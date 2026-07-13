import { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import { Bot } from 'lucide-react'

export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="aim-window">
      {messages.length === 0 && !isLoading && (
        <div className="aim-empty">
          <div className="aim-empty__icon"><Bot size={32} /></div>
          <p className="aim-empty__title">Bug Bounty Simulator AI Mentor</p>
          <p className="aim-empty__sub">Ask me anything about cybersecurity, ethical hacking, bug bounty, OWASP, and more.</p>
        </div>
      )}
      {messages.map(msg => (
        <ChatMessage key={msg.id} role={msg.role} message={msg.text} />
      ))}
      {isLoading && (
        <div className="aim-typing">
          <div className="aim-typing__avatar"><Bot size={14} /></div>
          <div className="aim-typing__dots">
            <span /><span /><span />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}