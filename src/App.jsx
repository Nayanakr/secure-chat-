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
    // Check if private key exists locally
    if (localStorage.getItem("privateKey")) return;
    // Generate key pair
    const keyPair = await window.crypto.subtle.generateKey(
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

  // Decrypt messages after fetching
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
          // Try to decrypt with recipientCipher first, then senderCipher
          if (privateKey && data.encrypted) {
            let decrypted = null;
            if (data.recipientCipher) {
              try {
                decrypted = await window.crypto.subtle.decrypt(
                  { name: "RSA-OAEP" },
                  privateKey,
                  base64ToArrayBuffer(data.recipientCipher)
                );
                text = new TextDecoder().decode(decrypted);
              } catch (e) {}
            }
            if (!decrypted && data.senderCipher) {
              try {
                decrypted = await window.crypto.subtle.decrypt(
                  { name: "RSA-OAEP" },
                  privateKey,
                  base64ToArrayBuffer(data.senderCipher)
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
  }, [db]);

  const handleSignOut = async () => {
    await firebaseSignOut(auth);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    // For demo: prompt for recipient email (in real app, select from user list)
    let recipientEmail = prompt(
      "Enter recipient email (for demo, use your own email to test):",
      user.email
    );
    if (!recipientEmail) return;
    // Find recipient by email
    let recipientUid = null;
    let recipientPublicKey = null;
    // Query users collection for recipient
    const usersSnapshot = await getDoc(doc(db, "users", user.uid));
    if (recipientEmail === user.email && usersSnapshot.exists()) {
      recipientUid = user.uid;
      recipientPublicKey = usersSnapshot.data().publicKey;
    } else {
      // In a real app, you would query by email
      alert(
        "Only your own email is supported in this demo. For multi-user, implement user lookup by email."
      );
      return;
    }
    // Encrypt for recipient
    const recipientKey = await importPublicKey(recipientPublicKey);
    const encoded = new TextEncoder().encode(newMessage);
    const recipientCipher = arrayBufferToBase64(
      await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        recipientKey,
        encoded
      )
    );
    // Encrypt for sender (so sender can also read their own message)
    const senderKey = recipientKey; // In demo, sender and recipient are the same
    const senderCipher = recipientCipher;
    await addDoc(collection(db, "messages"), {
      senderCipher,
      recipientCipher,
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
