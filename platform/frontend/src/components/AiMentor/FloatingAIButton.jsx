import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Floating action button, fixed to the bottom-right of the screen.
 * Clicking it navigates to the full AI Mentor page.
 * Mount this once at the layout level (e.g. in your Dashboard layout)
 * so it's visible on every page.
 */
export default function FloatingAIButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/ai-mentor")}
      title="Ask AI Mentor"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all hover:scale-105"
    >
      <span className="text-lg">🤖</span>
      <span className="text-sm font-medium hidden sm:inline">Ask AI</span>
    </button>
  );
}
