import React, { useState, useEffect, useRef } from "react";
import { auth, app } from "./firebase";
import { signOut as firebaseSignOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import AuthForm from "./AuthForm";
import ChatWindow from "./ChatWindow";

export default function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);

  // --- Key Management ---
  // Generate key pair and store public in Firestore, private in localStorage
  async function generateAndStoreKeys(user) {
    if (!user) return;
    let keyPair;
    if (localStorage.getItem("privateKey")) {
      // Private key exists, import it and update public key in Firestore
      const privateKeyJwk = JSON.parse(localStorage.getItem("privateKey"));
      const privateKey = await importPrivateKey(privateKeyJwk);
      // Derive public key from private key is not possible, so keep public key in localStorage too
      // For now, just skip key generation and update Firestore with the last known public key
      // If public key is not in localStorage, force key regeneration
      let publicKeyJwk = null;
      try {
        publicKeyJwk = JSON.parse(localStorage.getItem("publicKey"));
      } catch (e) {}
      if (!publicKeyJwk) {
        // No public key, force key regeneration
        localStorage.removeItem("privateKey");
        return await generateAndStoreKeys(user);
      }
      await setDoc(doc(db, "users", user.uid), {
        publicKey: publicKeyJwk,
        email: user.email,
      });
      return;
    }
    // Generate key pair
    keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
    // Export and store public key in Firestore
    const publicKeyJwk = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.publicKey
    );
    await setDoc(doc(db, "users", user.uid), {
      publicKey: publicKeyJwk,
      email: user.email,
    });
    // Store public key in localStorage for future logins
    localStorage.setItem("publicKey", JSON.stringify(publicKeyJwk));
    // Export and store private key in localStorage
    const privateKeyJwk = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.privateKey
    );
    localStorage.setItem("privateKey", JSON.stringify(privateKeyJwk));
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await generateAndStoreKeys(user);
      }
    });
    return unsubscribe;
  }, []);

  // Helper: import a JWK public key
  async function importPublicKey(jwk) {
    return await window.crypto.subtle.importKey(
      "jwk",
      jwk,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    );
  }

  // Helper: import a JWK private key
  async function importPrivateKey(jwk) {
    return await window.crypto.subtle.importKey(
      "jwk",
      jwk,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["decrypt"]
    );
  }

  // Helper: encode/decode base64
  function arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }
  function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }

  // Decrypt messages after fetching (group chat: decrypt with user's own UID)
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const privJwk = localStorage.getItem("privateKey");
      let privateKey = null;
      if (privJwk) privateKey = await importPrivateKey(JSON.parse(privJwk));
      const msgs = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let text = data.text;
          if (privateKey && data.encrypted && data.ciphers && user?.uid) {
            const myCipher = data.ciphers[user.uid];
            if (myCipher) {
              try {
                const decrypted = await window.crypto.subtle.decrypt(
                  { name: "RSA-OAEP" },
                  privateKey,
                  base64ToArrayBuffer(myCipher)
                );
                text = new TextDecoder().decode(decrypted);
              } catch (e) {}
            }
          }
          return { ...data, id: docSnap.id, text };
        })
      );
      setMessages(msgs);
    });
    return unsubscribe;
  }, [db, user]);

  const handleSignOut = async () => {
    await firebaseSignOut(auth);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    // True group chat: encrypt message for every user in the group
    // Fetch all users' public keys
    const usersCol = collection(db, "users");
    let allUsers = [];
    try {
      const qSnap = await (
        await import("firebase/firestore")
      ).getDocs(usersCol);
      allUsers = qSnap.docs.map((docSnap) => ({
        uid: docSnap.id,
        ...docSnap.data(),
      }));
    } catch (e) {
      alert("Failed to fetch users for group encryption.");
      return;
    }
    if (!allUsers.length) {
      alert("No users found for group encryption.");
      return;
    }
    // Check for users missing public keys
    const missingKeys = allUsers
      .filter((u) => !u.publicKey)
      .map((u) => u.email || u.uid);
    if (missingKeys.length > 0) {
      alert(
        "Warning: The following users are missing public keys and will NOT be able to read this message: " +
          missingKeys.join(", ")
      );
    }
    const encoded = new TextEncoder().encode(newMessage);
    const ciphers = {};
    for (const u of allUsers) {
      if (!u.publicKey) continue;
      try {
        const pubKey = await importPublicKey(u.publicKey);
        const cipher = arrayBufferToBase64(
          await window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            pubKey,
            encoded
          )
        );
        ciphers[u.uid] = cipher;
      } catch (e) {}
    }
    await addDoc(collection(db, "messages"), {
      ciphers, // map of uid -> ciphertext
      encrypted: true,
      createdAt: new Date(),
      uid: user.uid,
      email: user.email,
    });
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500">
        <AuthForm setLoading={setLoading} loading={loading} />
      </div>
    );
  }

  return (
    <ChatWindow
      user={user}
      messages={messages}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      handleSendMessage={handleSendMessage}
      handleSignOut={handleSignOut}
      handleKeyPress={handleKeyPress}
    />
  );
}
