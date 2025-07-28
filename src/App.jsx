import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageCircle } from "lucide-react";

const ChatApp = () => {
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
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleJoinChat = () => {
    if (username.trim()) {
      setIsJoined(true);
      // Add join message
      const joinMessage = {
        id: Date.now(),
        user: "System",
        text: `${username} joined the chat`,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true,
      };
      setMessages((prev) => [...prev, joinMessage]);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: username,
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
      if (!isJoined) {
        handleJoinChat();
      } else {
        handleSendMessage();
      }
    }
  };

  // Join screen
  if (!isJoined) {
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
              Enter your name to join the conversation
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Your name"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button
              onClick={handleJoinChat}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              Join Chat
            </button>
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
                <p className="text-sm text-gray-600">Connected as {username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Online</span>
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

export default ChatApp;
