import React,{useEffect, useRef} from "react";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({ messages, isLoading }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return(
        <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
                <ChatMessage key={message.id} message={message.text} />
            ))}
            {isLoading && (
                <div className="text-center text-gray-500 text-sm px-4 py-2 roundes-2xl rounded-bl-sm italic">
                    AI Mentoris thinking...
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    )
}