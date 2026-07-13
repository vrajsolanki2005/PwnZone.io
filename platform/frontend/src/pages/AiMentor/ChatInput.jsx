import { useState } from 'react'
import { Send } from 'lucide-react'

export default function ChatInput({ onSend, isLoading }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim() && !isLoading) {
      onSend(value.trim())
      setValue('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form className="aim-input-form" onSubmit={handleSubmit}>
      <input
        className="aim-input"
        type="text"
        placeholder="Ask a cybersecurity question..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        autoComplete="off"
      />
      <button
        className="aim-send-btn"
        type="submit"
        disabled={isLoading || !value.trim()}
      >
        <Send size={16} />
      </button>
    </form>
  )
}