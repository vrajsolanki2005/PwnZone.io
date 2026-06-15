import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Bell, CheckCircle } from 'lucide-react'
import './ComingSoon.css'

export default function ComingSoon({ icon, title, description, features = [] }) {
  const [notified, setNotified] = useState(false)

  return (
    <div className="cs-root">
      {/* Ambient blobs */}
      <div className="cs-blob cs-blob-1" />
      <div className="cs-blob cs-blob-2" />

      <motion.div
        className="cs-card"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Badge */}
        <div className="cs-badge">
          <Sparkles size={13} />
          Coming Soon
        </div>

        {/* Icon */}
        <motion.div
          className="cs-icon"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {icon}
        </motion.div>

        <h1 className="cs-title">{title}</h1>
        <p className="cs-description">{description}</p>

        {/* Feature pills */}
        {features.length > 0 && (
          <div className="cs-features">
            {features.map((f) => (
              <div key={f} className="cs-feature-pill">
                <CheckCircle size={12} className="cs-check" />
                {f}
              </div>
            ))}
          </div>
        )}

        {/* Notify button */}
        <motion.button
          className={`cs-btn${notified ? ' notified' : ''}`}
          onClick={() => setNotified(true)}
          whileTap={{ scale: 0.96 }}
          disabled={notified}
        >
          {notified ? (
            <><CheckCircle size={15} /> You'll be notified</>
          ) : (
            <><Bell size={15} /> Notify me when it's ready</>
          )}
        </motion.button>
      </motion.div>
    </div>
  )
}
