import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import './SearchInput.css'

export default function SearchInput({ placeholder = 'Search courses...', value, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <motion.div
      className={`search-wrap ${focused ? 'search-wrap--focused' : ''}`}
      animate={{ boxShadow: focused ? 'var(--shadow-focus)' : 'var(--shadow-card)' }}
      transition={{ duration: 0.2 }}
    >
      <Search className="search-icon" size={18} />
      <input
        className="search-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </motion.div>
  )
}
