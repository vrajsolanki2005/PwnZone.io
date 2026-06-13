import { motion } from 'framer-motion'
import './LabCard.css'

export default function LabCard({ id, title, points, category, priority, onStart }) {
  return (
    <motion.div
      className={`lab-card lab-card--${priority.toLowerCase()}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4, boxShadow: 'var(--shadow-hover)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="lab-card__header">
        <span className={`lab-card__priority lab-card__priority--${priority.toLowerCase()}`}>{priority}</span>
        <span className="lab-card__points">🏆 {points} pts</span>
      </div>

      <span className="lab-card__id">{id}</span>
      <p className="lab-card__title">{title}</p>
      <span className="lab-card__category">{category}</span>

      <button className="lab-card__btn" onClick={onStart}>Start</button>
    </motion.div>
  )
}
