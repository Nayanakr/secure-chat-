import React, { useState, useEffect, useRef } from "react";
import { Send, MessageCircle } from "lucide-react";
import AuthForm from "./AuthForm";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBsTxz003FAcNZ-_4GJzWU4kNyMdibxHus",
  authDomain: "chatapp-eda5b.firebaseapp.com",
  projectId: "chatapp-eda5b",
  storageBucket: "chatapp-eda5b.firebasestorage.app",
  messagingSenderId: "948377219297",
  appId: "1:948377219297:web:ad89411aea848bcfb087a0",
  measurementId: "G-719W5ZP0BZ",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const ChatApp = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "John",
      text: "Hey everyone!",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 2,
      user: "Sarah",
      text: "Hello! How is everyone doing?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Firebase Auth handlers
  const handleAuth = async (email, password, isSignUp) => {
    setLoading(true);
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
      const userObj = userCredential.user;
      setUser({
        email: userObj.email,
        displayName: userObj.email.split("@")[0],
      });
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setMessages([
      {
        id: 1,
        user: "John",
        text: "Hey everyone!",
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: 2,
        user: "Sarah",
        text: "Hello! How is everyone doing?",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && user) {
      const message = {
        id: Date.now(),
        user: user.displayName,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        isOwn: true,
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Auth screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center p-4">
        <AuthForm onSignIn={handleAuth} loading={loading} />
      </div>
    );
  }

  // Main chat interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500">
      <div className="container mx-auto p-4 h-screen flex flex-col max-w-4xl">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-t-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">MERN Chat</h1>
                <p className="text-sm text-gray-600">
                  Connected as {user.displayName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Online</span>
              <button
                onClick={signOut}
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white/90 backdrop-blur-sm p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.user === user.displayName
                  ? "justify-end"
                  : "justify-start"
              } ${message.isSystem ? "justify-center" : ""}`}
            >
              {message.isSystem ? (
                <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm">
                  {message.text}
                </div>
              ) : (
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                    message.user === user.displayName
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold ${
                        message.user === user.displayName
                          ? "text-purple-100"
                          : "text-purple-600"
                      }`}
                    >
                      {message.user === user.displayName ? "You" : message.user}
                    </span>
                    <span
                      className={`text-xs ${
                        message.user === user.displayName
                          ? "text-purple-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                  <p className="break-words">{message.text}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white/95 backdrop-blur-sm rounded-b-2xl p-4 shadow-lg">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-xl hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
