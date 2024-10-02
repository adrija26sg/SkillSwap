import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getMessages,
  sendMessage,
  subscribeToMessages,
  markMessagesAsRead,
} from "../services/messageService";
import { getUserData } from "../services/skillService";
import { formatDistanceToNow } from "date-fns";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Chat({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load messages and partner data
  useEffect(() => {
    const loadPartnerAndMessages = async () => {
      try {
        setLoading(true);
        const [partnerData, messagesData] = await Promise.all([
          getUserData(sessionId),
          getMessages(sessionId),
        ]);
        setPartner(partnerData);
        setMessages(messagesData);

        // Mark messages as read when opening the chat
        await markMessagesAsRead(sessionId);
      } catch (err) {
        setError("Failed to load messages");
        console.error("Error loading messages:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPartnerAndMessages();
  }, [sessionId]);

  useEffect(() => {
    // Subscribe to real-time message updates
    const unsubscribe = subscribeToMessages(sessionId, (updatedMessages) => {
      setMessages(updatedMessages);
      // Mark new messages as read
      markMessagesAsRead(sessionId).catch(console.error);
    });

    return () => unsubscribe();
  }, [sessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      const sentMessage = await sendMessage(sessionId, newMessage);
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (err) {
      setError("Failed to send message");
      console.error("Error sending message:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {partner?.name?.charAt(0) || "?"}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {partner?.name || "Unknown User"}
            </h3>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${
                message.senderId === sessionId ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === sessionId
                    ? "bg-gray-100 text-gray-900"
                    : "bg-blue-500 text-white"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <p className="text-xs opacity-70">
                    {formatDistanceToNow(new Date(message.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                  {message.senderId !== sessionId && (
                    <span className="text-xs opacity-70">
                      {message.read ? "✓✓" : "✓"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
