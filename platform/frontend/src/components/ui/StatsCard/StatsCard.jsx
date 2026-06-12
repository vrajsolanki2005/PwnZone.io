import { motion } from 'framer-motion'
import './StatsCard.css'

const colorMap = {
  purple: { bg: 'rgba(108,99,255,0.12)', color: 'var(--clr-purple-1)' },
  blue:   { bg: 'rgba(59,130,246,0.12)', color: 'var(--clr-blue-2)' },
  orange: { bg: 'rgba(255,184,77,0.12)', color: 'var(--clr-orange-2)' },
  green:  { bg: 'rgba(34,197,94,0.12)',  color: 'var(--clr-green)' },
  pink:   { bg: 'rgba(236,72,153,0.12)', color: 'var(--clr-pink)' },
}

export default function StatsCard({ icon, value, label, color = 'purple', trend }) {
  const c = colorMap[color] || colorMap.purple
  return (
    <motion.div
      className="stats-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4, boxShadow: 'var(--shadow-hover)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="stats-icon" style={{ background: c.bg, color: c.color }}>
        {icon}
      </div>
      <div className="stats-content">
        <span className="text-lg stats-value">{value}</span>
        <span className="text-caption">{label}</span>
        {trend && <span className="stats-trend">{trend}</span>}
      </div>
    </motion.div>
  )
}
