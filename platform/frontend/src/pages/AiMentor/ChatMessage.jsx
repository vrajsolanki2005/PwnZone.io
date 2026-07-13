import React from "react";

export default function ChatMessage({ role, message }) {
    const isUser = role === "user";

    return(
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${
                isUser 
                ? "bg-blue-500 text-white rounded-bl-sm rounded-tr-sm" 
                : "bg-gray-200 text-gray-800 rounded-br-sm rounded-tl-sm"
                }`}
            >
                {!isUser && <div className="text-sm font-semibold mb-1">AI Mentor</div>}
                <div className="text-sm">{message}</div>
            </div>
        </div>
    )
}