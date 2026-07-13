import { useRef, useEffect } from 'react'
import ChatWindow from './ChatWindow'
import ChatInput from './ChatInput'
import SuggestedQuestions from './SuggestedQuestions'
import useChat from '../../hooks/useChat'
import { useAuth } from '../../context/AuthContext'
import { Bot, Shield } from 'lucide-react'
import './AiMentor.css'

export default function AiMentor() {
  const { user } = useAuth()
  const { messages, isLoading, sendMessage } = useChat()
  const hasMessages = messages.length > 0

  return (
    <div className="aim-page">
      <div className="aim-header">
        <div className="aim-header__icon">
          <Bot size={22} />
        </div>
        <div>
          <h1 className="aim-header__title">AI Mentor</h1>
          <p className="aim-header__sub">
            Hey{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Ask me anything about cybersecurity.
          </p>
        </div>
        <div className="aim-header__badge">
          <Shield size={13} />
          Cybersecurity Only
        </div>
      </div>

      <div className="aim-chat">
        <ChatWindow messages={messages} isLoading={isLoading} />
        {!hasMessages && (
          <SuggestedQuestions onSelectQuestion={sendMessage} />
        )}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}