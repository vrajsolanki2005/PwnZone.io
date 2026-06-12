import { motion } from 'framer-motion'
import './AchievementCard.css'

export default function AchievementCard({ title, subtitle, icon = '🏆', gradient = 'achievement' }) {
  return (
    <motion.div
      className={`achievement-card achievement-card--${gradient}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="achievement-icon-wrap">
        <span className="achievement-icon">{icon}</span>
      </div>
      <div className="achievement-content">
        <span className="achievement-title">{title}</span>
        {subtitle && <span className="achievement-sub">{subtitle}</span>}
      </div>
    </motion.div>
  )
}
