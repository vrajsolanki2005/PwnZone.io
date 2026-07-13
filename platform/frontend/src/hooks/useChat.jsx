import {useState, useCallback} from "react";
import { sendChatMessage } from "../api/aiMentorApi";

/**
 * Manage chat message state +talking to the backend API.
 * Each message:{ id, role:user | assistant, text }
 */

export default function useChat(initialMessages = []) {
    const [messages, setMessages] = useState(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = useCallback(async (text) => {
        const trimmedText = text.trim();
        if (!trimmedText) return;

        // Add user message
        const userMessage = { id: Date.now(), role: "user", text: trimmedText };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const history = messages.map((msg) => ({ role: msg.role, content: msg.text }));
            const aiResponse = await sendChatMessage(trimmedText, history);
            const aiMessage = { id: Date.now() + 1, role: "assistant", text: aiResponse };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            setError("Failed to send message. Please try again.", error.message);
            const errorMessage = { id: Date.now() + 2, role: "assistant", text: "Error: Failed to send message. Please try again." };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { messages, isLoading, sendMessage, error };
}