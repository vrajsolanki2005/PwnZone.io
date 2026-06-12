import { motion } from 'framer-motion'
import './MentorCard.css'

export default function MentorCard({ avatar, name, role, rating, students }) {
  return (
    <motion.div
      className="mentor-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4, boxShadow: 'var(--shadow-hover)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="mentor-avatar-wrap">
        {avatar
          ? <img src={avatar} alt={name} className="mentor-avatar" />
          : <div className="mentor-avatar mentor-avatar-fallback">{name?.[0]}</div>
        }
        {rating && (
          <span className="mentor-rating">⭐ {rating}</span>
        )}
      </div>
      <div className="mentor-info">
        <span className="text-title">{name}</span>
        <span className="text-caption">{role}</span>
        {students && <span className="text-caption mentor-students">{students} students</span>}
      </div>
    </motion.div>
  )
}
