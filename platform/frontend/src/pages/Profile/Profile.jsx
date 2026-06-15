import { motion } from 'framer-motion'
import { Trophy, Target, Flame, TrendingUp, Shield, MapPin, Calendar, Edit3 } from 'lucide-react'

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
import './Profile.css'

const USER = {
  name: 'Jay Shah',
  handle: '@jayshah',
  avatar: 'JS',
  bio: 'Bug hunter · CTF player · Breaking things for fun and profit.',
  location: 'Ahmedabad, IN',
  joined: 'Jan 2024',
  github: 'github.com/jayshah',
  twitter: '@jayshah_sec',
  level: 7,
  title: 'Elite Hacker',
  nextTitle: 'Master Hacker',
  xp: { current: 3240, next: 5000 },
  rank: 1,
  points: 15200,
  labs: 58,
  streak: 31,
  maxStreak: 31,
}

const STATS = [
  { label: 'Total Points', value: '15,200', icon: Trophy,     color: '#FFD700' },
  { label: 'Global Rank',  value: '#1',     icon: TrendingUp, color: '#6C63FF' },
  { label: 'Labs Solved',  value: '58',     icon: Target,     color: '#22C55E' },
  { label: 'Day Streak',   value: '31',     icon: Flame,      color: '#f97316' },
]

const PRIORITY_SOLVED = [
  { key: 'P1', label: '🔴 Critical', solved: 17, total: 20, color: '#ef4444' },
  { key: 'P2', label: '🟠 High',     solved: 22, total: 40, color: '#FF9F43' },
  { key: 'P3', label: '🟡 Medium',   solved: 12, total: 14, color: '#eab308' },
  { key: 'P4', label: '🟢 Low',      solved: 7,  total: 6,  color: '#22C55E' },
]

const BADGES = [
  { icon: '🔥', label: 'Streak Master',  desc: '30-day streak' },
  { icon: '💉', label: 'Injection King', desc: 'All injection labs' },
  { icon: '🔐', label: 'Auth Breaker',   desc: 'All auth labs' },
  { icon: '🥇', label: 'Top Ranked',     desc: 'Reached #1' },
  { icon: '⚡', label: 'Speed Runner',   desc: 'Lab in under 5m' },
  { icon: '🌐', label: 'SSRF Hunter',    desc: '5 SSRF labs' },
]

const RECENT = [
  { id: 'TM-14', title: 'SSRF Concept Demonstration',        priority: 'P1', points: 100, color: '#ef4444', time: '2h ago' },
  { id: 'TM-09', title: 'JWT Security Scenario',             priority: 'P1', points: 100, color: '#ef4444', time: '5h ago' },
  { id: 'TM-34', title: 'GraphQL Mutation Security Scenario',priority: 'P2', points: 75,  color: '#FF9F43', time: '1d ago' },
  { id: 'TM-41', title: 'Reflected XSS Awareness',           priority: 'P3', points: 50,  color: '#eab308', time: '2d ago' },
  { id: 'TM-55', title: 'Clickjacking Awareness',            priority: 'P4', points: 25,  color: '#22C55E', time: '3d ago' },
]

// 10 weeks × 7 days heatmap — 1=active, 0=inactive
const HEATMAP = Array.from({ length: 10 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => (Math.random() > 0.45 ? Math.ceil(Math.random() * 4) : 0))
)

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const stagger = { show: { transition: { staggerChildren: 0.07 } } }
const fadeUp  = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }

export default function Profile() {
  const xpPct = (USER.xp.current / USER.xp.next) * 100

  return (
    <motion.div className="pf" initial="hidden" animate="show" variants={stagger}>

      {/* ── Hero banner ─────────────────────────────────── */}
      <motion.div className="pf-hero" variants={fadeUp}>
        <div className="pf-hero__glow" />
        <button className="pf-hero__edit"><Edit3 size={14} /> Edit Profile</button>

        <div className="pf-hero__body">
          <div className="pf-hero__avatar">{USER.avatar}</div>

          <div className="pf-hero__info">
            <div className="pf-hero__name-row">
              <h1 className="pf-hero__name">{USER.name}</h1>
              <span className="pf-hero__level-badge">Lvl {USER.level}</span>
              <span className="pf-hero__title-badge"><Shield size={12} /> {USER.title}</span>
            </div>
            <p className="pf-hero__handle">{USER.handle}</p>
            <p className="pf-hero__bio">{USER.bio}</p>

            <div className="pf-hero__meta">
              <span><MapPin size={12} /> {USER.location}</span>
              <span><Calendar size={12} /> Joined {USER.joined}</span>
              <span><GithubIcon size={12} /> {USER.github}</span>
              <span><TwitterIcon size={12} /> {USER.twitter}</span>
            </div>
          </div>
        </div>

        {/* XP bar inside hero */}
        <div className="pf-xp">
          <div className="pf-xp__labels">
            <span>{USER.title}</span>
            <span className="pf-xp__nums">{USER.xp.current.toLocaleString()} / {USER.xp.next.toLocaleString()} XP</span>
            <span>{USER.nextTitle}</span>
          </div>
          <div className="pf-xp__track">
            <motion.div
              className="pf-xp__fill"
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            />
            <motion.div
              className="pf-xp__glow"
              initial={{ left: 0 }}
              animate={{ left: `${xpPct}%` }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Stats strip ─────────────────────────────────── */}
      <motion.div className="pf-stats" variants={stagger}>
        {STATS.map(s => (
          <motion.div key={s.label} className="pf-stat" variants={fadeUp} whileHover={{ y: -4, boxShadow: 'var(--shadow-hover)' }}>
            <div className="pf-stat__icon" style={{ background: `${s.color}18`, color: s.color }}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="pf-stat__value">{s.value}</p>
              <p className="pf-stat__label">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Main grid ───────────────────────────────────── */}
      <div className="pf-grid">

        {/* Left col */}
        <div className="pf-col">

          {/* Priority breakdown */}
          <motion.div className="pf-card" variants={fadeUp}>
            <h2 className="pf-card__title">Labs by Priority</h2>
            <div className="pf-priority-list">
              {PRIORITY_SOLVED.map((p, i) => (
                <div key={p.key} className="pf-priority-row">
                  <div className="pf-priority-row__top">
                    <span className="pf-priority-row__label">{p.label}</span>
                    <span className="pf-priority-row__count" style={{ color: p.color }}>{p.solved}/{p.total}</span>
                  </div>
                  <div className="pf-priority-row__track">
                    <motion.div
                      className="pf-priority-row__fill"
                      style={{ background: p.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((p.solved / p.total) * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div className="pf-card" variants={fadeUp}>
            <h2 className="pf-card__title">Badges</h2>
            <div className="pf-badges">
              {BADGES.map(b => (
                <motion.div key={b.label} className="pf-badge" whileHover={{ scale: 1.08, y: -3 }}>
                  <span className="pf-badge__icon">{b.icon}</span>
                  <span className="pf-badge__label">{b.label}</span>
                  <span className="pf-badge__desc">{b.desc}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right col */}
        <div className="pf-col">

          {/* Activity heatmap */}
          <motion.div className="pf-card" variants={fadeUp}>
            <h2 className="pf-card__title">Activity</h2>
            <div className="pf-heatmap">
              <div className="pf-heatmap__days">
                {DAYS.map((d, i) => <span key={i}>{d}</span>)}
              </div>
              <div className="pf-heatmap__grid">
                {HEATMAP.map((week, w) => (
                  <div key={w} className="pf-heatmap__week">
                    {week.map((v, d) => (
                      <motion.div
                        key={d}
                        className="pf-heatmap__cell"
                        data-level={v}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.01 * (w * 7 + d), duration: 0.2 }}
                        title={`${v} lab${v !== 1 ? 's' : ''}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent activity */}
          <motion.div className="pf-card" variants={fadeUp}>
            <h2 className="pf-card__title">Recent Completions</h2>
            <div className="pf-recent">
              {RECENT.map((r, i) => (
                <motion.div
                  key={r.id}
                  className="pf-recent__row"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="pf-recent__dot" style={{ background: r.color }} />
                  <div className="pf-recent__info">
                    <span className="pf-recent__id">{r.id}</span>
                    <span className="pf-recent__title">{r.title}</span>
                  </div>
                  <div className="pf-recent__right">
                    <span className="pf-recent__pts" style={{ color: r.color }}>+{r.points} pts</span>
                    <span className="pf-recent__time">{r.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}
