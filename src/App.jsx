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

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [db]);

  const handleSignOut = async () => {
    await firebaseSignOut(auth);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
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
