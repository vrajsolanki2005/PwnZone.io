import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Small card for the Dashboard grid, per the spec:
 * ------------------------------
 * AI Mentor
 * "What would you like to learn?"
 * [ Ask AI ]
 * ------------------------------
 */
export default function AiMentorWidget() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm p-5 bg-white flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🤖</span>
          <h3 className="text-base font-semibold text-gray-800">AI Mentor</h3>
        </div>
        <p className="text-sm text-gray-500">What would you like to learn?</p>
      </div>

      <button
        onClick={() => navigate("/ai-mentor")}
        className="mt-4 self-start px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
      >
        Ask AI
      </button>
    </div>
  );
}
