import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getConversations } from "../services/messageService";
import { getUserData } from "../services/skillService";

function ConversationList({ onSelectConversation }) {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        setError("");

        // Get all conversations
        const conversationsData = await getConversations(currentUser.uid);

        // Get user data for each conversation partner
        const conversationsWithUserData = await Promise.all(
          conversationsData.map(async (conversation) => {
            const partnerId = conversation.partnerId;
            const userData = await getUserData(partnerId);
            return {
              ...conversation,
              partner: userData,
            };
          })
        );

        setConversations(conversationsWithUserData);
      } catch (error) {
        console.error("Error loading conversations:", error);
        setError("Failed to load conversations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [currentUser.uid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No conversations yet. Start exchanging skills to begin chatting!
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => (
        <button
          key={conversation.partnerId}
          onClick={() => onSelectConversation(conversation.partnerId)}
          className="w-full p-4 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-150"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-lg">
                  {conversation.partner.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {conversation.partner.name}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(
                    conversation.lastMessage.timestamp.toDate()
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {conversation.lastMessage.content}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default ConversationList;
