import React, { useState } from "react";
import ConversationList from "./ConversationList";
import Chat from "./Chat";

function Messaging() {
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversation List Sidebar */}
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        </div>
        <ConversationList onSelectConversation={setSelectedSessionId} />
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        {selectedSessionId ? (
          <Chat sessionId={selectedSessionId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Messaging;
