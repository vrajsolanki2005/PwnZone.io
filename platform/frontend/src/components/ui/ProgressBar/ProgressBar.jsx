import { motion } from 'framer-motion'
import './ProgressBar.css'

export default function ProgressBar({ value = 0, height = 8, color = 'purple' }) {
  return (
    <div className="progress-track" style={{ height }}>
      <motion.div
        className={`progress-fill progress-fill--${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ height }}
      />
    </div>
  )
}
