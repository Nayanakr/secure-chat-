import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageCircle, Mail, Lock, LogOut } from "lucide-react";

// Firebase configuration (you'll need to install firebase: npm install firebase)
const firebaseConfig = {
  apiKey: "AIzaSyBsTxz003FAcNZ-_4GJzWU4kNyMdibxHus",
  authDomain: "chatapp-eda5b.firebaseapp.com",
  projectId: "chatapp-eda5b",
  storageBucket: "chatapp-eda5b.firebasestorage.app",
  messagingSenderId: "948377219297",
  appId: "1:948377219297:web:ad89411aea848bcfb087a0",
  measurementId: "G-719W5ZP0BZ",
};

const App = () => {
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
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock Firebase auth functions (replace with actual Firebase imports)
  const signInWithEmail = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      // Simulate Firebase auth
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser = {
        uid: Date.now().toString(),
        email: email,
        displayName: email.split("@")[0],
      };
      setUser(mockUser);

      // Add join message
      const joinMessage = {
        id: Date.now(),
        user: "System",
        text: `${mockUser.displayName} joined the chat`,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true,
      };
      setMessages((prev) => [...prev, joinMessage]);
    } catch (err) {
      setError("Authentication failed. Please try again.");
    }
    setLoading(false);
  };

  const signUpWithEmail = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      // Simulate Firebase auth
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser = {
        uid: Date.now().toString(),
        email: email,
        displayName: email.split("@")[0],
      };
      setUser(mockUser);

      // Add join message
      const joinMessage = {
        id: Date.now(),
        user: "System",
        text: `${mockUser.displayName} joined the chat`,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true,
      };
      setMessages((prev) => [...prev, joinMessage]);
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      // Simulate Google auth
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser = {
        uid: Date.now().toString(),
        email: "user@gmail.com",
        displayName: "Google User",
      };
      setUser(mockUser);

      // Add join message
      const joinMessage = {
        id: Date.now(),
        user: "System",
        text: `${mockUser.displayName} joined the chat`,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true,
      };
      setMessages((prev) => [...prev, joinMessage]);
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    }
    setLoading(false);
  };

  const signOut = () => {
    setUser(null);
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (isLogin) {
      await signInWithEmail(email, password);
    } else {
      await signUpWithEmail(email, password);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && user) {
      const message = {
        id: Date.now(),
        user: user.displayName || user.email.split("@")[0],
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
      if (!user) {
        handleAuth();
      } else {
        handleSendMessage();
      }
    }
  };

  // Authentication screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to Chat
            </h1>
            <p className="text-gray-600">
              {isLogin ? "Sign in to continue" : "Create your account"}
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
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
                  Welcome, {user.displayName || user.email.split("@")[0]}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
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
                message.isOwn ? "justify-end" : "justify-start"
              } ${message.isSystem ? "justify-center" : ""}`}
            >
              {message.isSystem ? (
                <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm">
                  {message.text}
                </div>
              ) : (
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                    message.isOwn
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold ${
                        message.isOwn ? "text-purple-100" : "text-purple-600"
                      }`}
                    >
                      {message.isOwn ? "You" : message.user}
                    </span>
                    <span
                      className={`text-xs ${
                        message.isOwn ? "text-purple-100" : "text-gray-500"
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

export default App;
