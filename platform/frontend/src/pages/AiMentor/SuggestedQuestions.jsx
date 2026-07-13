const DEFAULT_QUESTIONS = [
  'What is SQL Injection and how to prevent it?',
  'Explain Cross-Site Scripting (XSS)',
  'How does JWT authentication work?',
  'OWASP Top 10 vulnerabilities explained',
  'How to start Bug Bounty hunting?',
  'What is SSRF and how to exploit it?',
  'Explain IDOR vulnerability',
  'How does CSRF attack work?',
]

export default function SuggestedQuestions({ onSelectQuestion, questions = DEFAULT_QUESTIONS }) {
  return (
    <div className="aim-suggestions">
      <p className="aim-suggestions__label">Try asking:</p>
      <div className="aim-suggestions__list">
        {questions.map((q, i) => (
          <button
            key={i}
            className="aim-suggestion-btn"
            onClick={() => onSelectQuestion(q)}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}