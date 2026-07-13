import React from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";
import useChat from "../../hooks/useChat";

export default function AiMentor() {
  const userName = "User"; // Replace with actual user name if available  
    const { messages, isLoading, sendMessage, error } = useChat();

    const handleSendMessage = (message) => {
        sendMessage(message);
    };

    const handleSelectQuestion = (question) => {
        sendMessage(question);
    };

    return (
        <div className="flex flex-col h-full border rounded-lg shadow-md">
            <div className="flex-1 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-100 border-b border-gray-300 p-4">
                <h2 className="text-lg font-semibold">AI Mentor</h2>
                <p className="text-sm text-gray-500">Hello, {userName}! How can I assist you today? : "CyberSecurity Q&A"</p>
              </div>
              {/* Chat Window */}
              <ChatWindow messages={messages} isLoading={isLoading} />
              {/* Chat Input */}
              <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
              {/* Suggested Questions */}
              <SuggestedQuestions onSelectQuestion={handleSelectQuestion} />
            </div>
          </div>
        )
      }