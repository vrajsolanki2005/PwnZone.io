import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Trophy, Target, Flame, TrendingUp, Shield, MapPin, Calendar, Edit3 } from 'lucide-react'
import { userApi } from '../../services/api'
import './Profile.css'

const TwitterIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

const PRIORITY_COLORS = { P1: '#ef4444', P2: '#FF9F43', P3: '#eab308', P4: '#22C55E' }
const DAYS      = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const WEEKS     = 18

const stagger = { show: { transition: { staggerChildren: 0.07 } } }
const fadeUp  = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

// Get YYYY-MM-DD in IST for any JS Date
function toIST(date) {
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

// Add N days to a YYYY-MM-DD string without timezone issues
function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d + n)
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
}

// Build heatmap — returns { grid: [[{date,count}]], months: [{label,col}] }
// Grid always ends on today (IST). Last column = this week, last row = today's weekday.
function buildHeatmap(activity) {
  const map = {}
  activity.forEach(a => { map[a.date] = Math.min(a.count, 4) })

  const todayStr = toIST(new Date())
  // day-of-week index for today (0=Mon)
  const todayDow = (new Date(todayStr + 'T12:00:00').getDay() + 6) % 7
  // last cell is today, so last column ends at today
  // total cells = WEEKS * 7, last cell index = WEEKS*7-1
  // today sits at position (WEEKS-1)*7 + todayDow
  const cellsFromStart = (WEEKS - 1) * 7 + todayDow
  const startStr = addDays(todayStr, -cellsFromStart)

  const grid = []
  const months = []
  let lastMonth = -1

  for (let w = 0; w < WEEKS; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const key = addDays(startStr, w * 7 + d)
      // don't render future cells
      const isFuture = key > todayStr
      const month = Number(key.slice(5, 7))
      if (d === 0 && month !== lastMonth) {
        months.push({ label: new Date(key + 'T12:00:00').toLocaleString('default', { month: 'short' }), col: w })
        lastMonth = month
      }
      week.push({ date: key, count: isFuture ? -1 : (map[key] || 0) })
    }
    grid.push(week)
  }
  return { grid, months }
}

// Build last-7-days streak calendar in IST
function buildWeekStreak(activity) {
  const map = {}
  activity.forEach(a => { map[a.date] = a.count })
  const todayStr = toIST(new Date())
  const days = []
  for (let i = 6; i >= 0; i--) {
    const key = addDays(todayStr, -i)
    const dow = (new Date(key + 'T12:00:00').getDay() + 6) % 7
    days.push({ label: DAYS[dow], date: key, active: (map[key] || 0) > 0 })
  }
  return days
}

export default function Profile() {
  const [data, setData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    userApi.getProfile().then(r => setData(r.data)).catch(() => {})
  }, [])

  if (!data) return <div className="pf-loading">Loading...</div>

  const { user, stats, recent, activity } = data
  const xpInLevel = stats.total_points - stats.level_start
  const xpNeeded  = stats.level_end - stats.level_start
  const xpPct     = Math.min((xpInLevel / xpNeeded) * 100, 100)
  const { grid: heatmap, months } = buildHeatmap(activity)
  const weekStreak = buildWeekStreak(activity)
  const initials  = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const STATS = [
    { label: 'Total Points', value: stats.total_points.toLocaleString(), icon: Trophy,     color: '#FFD700' },
    { label: 'Global Rank',  value: `#${stats.rank}`,                    icon: TrendingUp, color: '#6C63FF' },
    { label: 'Labs Solved',  value: String(stats.total_completed),       icon: Target,     color: '#22C55E' },
    { label: 'Day Streak',   value: String(stats.current_streak),        icon: Flame,      color: '#f97316' },
  ]

  return (
    <motion.div className="pf" initial="hidden" animate="show" variants={stagger}>

      {/* Hero */}
      <motion.div className="pf-hero" variants={fadeUp}>
        <div className="pf-hero__glow" />
        <button className="pf-hero__edit" onClick={() => navigate('/settings')}><Edit3 size={14} /> Edit Profile</button>
        <div className="pf-hero__body">
          <div className="pf-hero__avatar">
            {user.avatar?.startsWith('http')
              ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : initials
            }
          </div>
          <div className="pf-hero__info">
            <div className="pf-hero__name-row">
              <h1 className="pf-hero__name">{user.name}</h1>
              <span className="pf-hero__level-badge">Lvl {stats.level}</span>
              <span className="pf-hero__title-badge"><Shield size={12} /> {stats.level_title}</span>
            </div>
            <p className="pf-hero__handle">@{user.name.toLowerCase().replace(/\s+/g, '')}</p>
            {user.bio && <p className="pf-hero__bio">{user.bio}</p>}
            <div className="pf-hero__meta">
              {user.location && <span><MapPin size={12} /> {user.location}</span>}
              <span><Calendar size={12} /> Joined {user.joined}</span>
              {user.github  && <span><GithubIcon size={12} /> {user.github}</span>}
              {user.twitter && <span><TwitterIcon size={12} /> {user.twitter}</span>}
            </div>
          </div>
        </div>
        <div className="pf-xp">
          <div className="pf-xp__labels">
            <span>{stats.level_title}</span>
            <span className="pf-xp__nums">{stats.total_points.toLocaleString()} / {stats.level_end.toLocaleString()} pts</span>
            <span>{stats.next_title}</span>
          </div>
          <div className="pf-xp__track">
            <motion.div className="pf-xp__fill" initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }} />
            <motion.div className="pf-xp__glow" initial={{ left: 0 }} animate={{ left: `${xpPct}%` }} transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }} />
          </div>
        </div>
      </motion.div>

      {/* Stats strip */}
      <motion.div className="pf-stats" variants={stagger}>
        {STATS.map(s => (
          <motion.div key={s.label} className="pf-stat" variants={fadeUp} whileHover={{ y: -4, boxShadow: 'var(--shadow-hover)' }}>
            <div className="pf-stat__icon" style={{ background: `${s.color}18`, color: s.color }}><s.icon size={18} /></div>
            <div>
              <p className="pf-stat__value">{s.value}</p>
              <p className="pf-stat__label">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main grid */}
      <div className="pf-grid">
        <div className="pf-col">

          {/* Priority breakdown */}
          <motion.div className="pf-card" variants={fadeUp}>
            <h2 className="pf-card__title">Labs by Priority</h2>
            <div className="pf-priority-list">
              {stats.by_priority.map((p, i) => (
                <div key={p.key} className="pf-priority-row">
                  <div className="pf-priority-row__top">
                    <span className="pf-priority-row__label">{p.label}</span>
                    <span className="pf-priority-row__count" style={{ color: p.color }}>{p.completed}/{p.total}</span>
                  </div>
                  <div className="pf-priority-row__track">
                    <motion.div
                      className="pf-priority-row__fill"
                      style={{ background: p.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${p.total ? Math.min((p.completed / p.total) * 100, 100) : 0}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Streak card */}
          <motion.div className="pf-card" variants={fadeUp}>
            <h2 className="pf-card__title">Streak</h2>
            <div className="pf-streak">
              <div className="pf-streak__top">
                <span className="pf-streak__icon">🔥</span>
                <div>
                  <span className="pf-streak__num">{stats.current_streak}</span>
                  <span className="pf-streak__unit"> day streak</span>
                </div>
              </div>
              <div className="pf-streak__week">
                {weekStreak.map((d) => (
                  <div key={d.date} className={`pf-streak__day${d.active ? ' pf-streak__day--active' : ''}`}>
                    <span className="pf-streak__day-dot" />
                    <span className="pf-streak__day-label">{d.label}</span>
                  </div>
                ))}
              </div>
              <div className="pf-streak__stats">
                <div className="pf-streak__stat"><span>{stats.current_streak}</span><span>Current</span></div>
                <div className="pf-streak__divider" />
                <div className="pf-streak__stat"><span>{stats.max_streak}</span><span>Best</span></div>
                <div className="pf-streak__divider" />
                <div className="pf-streak__stat"><span>{stats.total_completed}</span><span>Total</span></div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="pf-col">

          {/* Activity heatmap */}
          <motion.div className="pf-card" variants={fadeUp}>
            <h2 className="pf-card__title">Activity</h2>
            <div className="pf-heatmap">
              <div className="pf-heatmap__month-row">
                {months.map((m, i) => (
                  <span key={i} className="pf-heatmap__month" style={{ gridColumn: m.col + 1 }}>{m.label}</span>
                ))}
              </div>
              <div className="pf-heatmap__inner">
                <div className="pf-heatmap__days">
                  {DAY_SHORT.map((d, i) => <span key={i}>{i % 2 === 0 ? d : ''}</span>)}
                </div>
                <div className="pf-heatmap__grid">
                  {heatmap.map((week, w) => (
                    <div key={w} className="pf-heatmap__week">
                      {week.map((cell, d) => (
                        <motion.div
                          key={d}
                          className="pf-heatmap__cell"
                          data-level={cell.count}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.005 * (w * 7 + d), duration: 0.2 }}
                          title={cell.count >= 0 ? `${cell.date}: ${cell.count} lab${cell.count !== 1 ? 's' : ''}` : ''}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pf-heatmap__legend">
              <span>Less</span>
              {[0,1,2,3,4].map(l => <span key={l} className="pf-heatmap__cell" data-level={l} />)}
              <span>More</span>
            </div>
          </motion.div>

          {/* Recent completions */}
          <motion.div className="pf-card" variants={fadeUp}>
            <h2 className="pf-card__title">Recent Completions</h2>
            {recent.length === 0
              ? <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No labs completed yet.</p>
              : (
                <div className="pf-recent">
                  {recent.map((r, i) => {
                    const color = PRIORITY_COLORS[r.difficulty] || '#7c6af7'
                    return (
                      <motion.div
                        key={r.slug}
                        className="pf-recent__row"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="pf-recent__dot" style={{ background: color }} />
                        <div className="pf-recent__info">
                          <span className="pf-recent__id">{r.difficulty}</span>
                          <span className="pf-recent__title">{r.title}</span>
                        </div>
                        <div className="pf-recent__right">
                          <span className="pf-recent__pts" style={{ color }}>+{r.points_earned} pts</span>
                          <span className="pf-recent__time">{timeAgo(r.completed_at)}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )
            }
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
