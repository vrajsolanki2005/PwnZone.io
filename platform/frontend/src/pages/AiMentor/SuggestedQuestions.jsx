import React from "react";

const DEFAULT_QUESTIONS = [
    "Explain SQL Injection",
    "What is Cross-Site Scripting (XSS)?",
    "How does a firewall work?",
    "Explain JWT",
    "OWASP Top 10 vulnerabilities",
    "How to become a Bug Bounty Hunter?",
];

export default function SuggestedQuestions({ onSelectQuestion, questions = DEFAULT_QUESTIONS }) {
    return (
        <div className="px-4 py-3">
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Try these:
            </p>
            <div className="flex flex-wrap gap-2">
                {questions.map((question, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectQuestion(question)}
                        className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
                    >
                        {question}
                    </button>
                ))}
            </div>
        </div>
    );
}