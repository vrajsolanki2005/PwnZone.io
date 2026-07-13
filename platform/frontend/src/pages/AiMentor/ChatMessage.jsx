import { Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function ChatMessage({ role, message }) {
  const isUser = role === 'user'

  return (
    <div className={`aim-msg ${isUser ? 'aim-msg--user' : 'aim-msg--ai'}`}>
      {!isUser && (
        <div className="aim-msg__avatar aim-msg__avatar--ai">
          <Bot size={14} />
        </div>
      )}
      <div className={`aim-msg__bubble ${isUser ? 'aim-msg__bubble--user' : 'aim-msg__bubble--ai'}`}>
        {isUser ? (
          <p className="aim-msg__text">{message}</p>
        ) : (
          <div className="aim-msg__markdown">
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="aim-msg__avatar aim-msg__avatar--user">
          <User size={14} />
        </div>
      )}
    </div>
  )
}