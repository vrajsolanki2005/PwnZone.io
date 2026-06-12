import { motion } from 'framer-motion'
import './CircularProgress.css'

export default function CircularProgress({ value = 0, size = 96, strokeWidth = 8, color = 'purple' }) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ
  const gradId = `cpGrad-${color}`

  const gradColors = {
    purple: ['#6C63FF', '#60A5FA'],
    blue:   ['#60A5FA', '#3B82F6'],
    orange: ['#FFB84D', '#FF9F43'],
    green:  ['#34d399', '#22C55E'],
    pink:   ['#f472b6', '#EC4899'],
  }
  const [c1, c2] = gradColors[color] || gradColors.purple

  return (
    <div className="circ-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="var(--clr-border)"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="circ-label">{value}%</span>
    </div>
  )
}
