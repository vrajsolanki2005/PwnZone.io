import React, {useState} from "react";

export default function ChatInput({ onSend, isLoading }) {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            onSend(inputValue.trim());
            setInputValue("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center p-4 border-t border-gray-300">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-100 text-gray-800 placeholder:text-gray-500 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isLoading || !inputValue.trim()}
            >
                Send
            </button>
        </form>
    );
}