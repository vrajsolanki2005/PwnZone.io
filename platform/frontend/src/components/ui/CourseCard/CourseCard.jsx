import { motion } from 'framer-motion'
import ProgressBar from '../ProgressBar/ProgressBar'
import './CourseCard.css'

export default function CourseCard({
  thumbnail,
  category,
  title,
  instructor,
  duration,
  progress = 0,
  tagColor = 'purple',
}) {
  return (
    <motion.div
      className="course-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4, boxShadow: 'var(--shadow-hover)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="course-thumb" style={{ background: thumbnail ? undefined : 'var(--grad-primary)' }}>
        {thumbnail
          ? <img src={thumbnail} alt={title} />
          : <span className="course-thumb-placeholder">📚</span>
        }
        <span className={`course-tag course-tag--${tagColor}`}>{category}</span>
      </div>

      <div className="course-body">
        <p className="text-title course-title">{title}</p>
        <div className="course-meta">
          <span className="text-caption">{instructor}</span>
          <span className="text-caption course-dot">·</span>
          <span className="text-caption">{duration}</span>
        </div>
        {progress > 0 && (
          <div className="course-progress">
            <div className="course-progress-header">
              <span className="text-caption">Progress</span>
              <span className="text-caption text-accent">{progress}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
