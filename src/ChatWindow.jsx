import React, { useRef, useEffect } from "react";

export default function ChatWindow({
  user,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleSignOut,
  handleKeyPress,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg flex flex-col h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h1 className="text-xl font-bold">Firebase Chat</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.uid === user.uid ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg shadow text-sm max-w-xs break-words ${
                  msg.uid === user.uid
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <span className="block font-semibold">
                  {msg.uid === user.uid ? "You" : msg.email}
                </span>
                <span>{msg.text}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={!newMessage.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
