import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Crown, Medal, Award } from 'lucide-react'
import { leaderboardApi } from '../../services/api'
import './Leaderboard.css'

const TABS = [
  { label: 'Weekly',   period: 'weekly'  },
  { label: 'Monthly',  period: 'monthly' },
  { label: 'All Time', period: 'all'     },
]

const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

const RankIcon = ({ rank }) => {
  if (rank === 1) return <Crown size={14} className="lb-rank-icon gold" />
  if (rank === 2) return <Medal size={14} className="lb-rank-icon silver" />
  if (rank === 3) return <Award size={14} className="lb-rank-icon bronze" />
  return null
}

function Avatar({ user }) {
  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  if (user.avatar?.startsWith('http'))
    return <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
  return <>{initials}</>
}

export default function Leaderboard() {
  const [tab,     setTab]     = useState('all')
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    leaderboardApi.get(tab)
      .then(r => setPlayers(r.data))
      .catch(e => setError(e?.response?.data?.message || 'Failed to load leaderboard.'))
      .finally(() => setLoading(false))
  }, [tab])

  const podium = players.length >= 3 ? [players[1], players[0], players[2]] : []

  return (
    <div className="lb-page">
      <div className="lb-hero">
        <div className="lb-hero__glow" />
        <div className="lb-hero__content">
          <span className="lb-hero__eyebrow"><Flame size={14} /> Live Rankings</span>
          <h1 className="lb-hero__title">Leaderboard</h1>
          <p className="lb-hero__sub">Compete. Hack. Dominate the ranks.</p>
        </div>

        <div className="lb-tabs">
          {TABS.map(t => (
            <button
              key={t.period}
              className={`lb-tab${tab === t.period ? ' lb-tab--active' : ''}`}
              onClick={() => setTab(t.period)}
            >
              {tab === t.period && <motion.div className="lb-tab__bg" layoutId="lb-tab-bg" />}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {podium.length === 3 && (
          <div className="lb-podium">
            {podium.map((p, i) => {
              const isGold  = p.rank === 1
              const podiumH = [100, 130, 80][i]
              const color   = ['#C0C0C0', '#FFD700', '#CD7F32'][i]
              return (
                <motion.div
                  key={p.id}
                  className={`lb-pod${isGold ? ' lb-pod--gold' : ''}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="lb-pod__meta">
                    {isGold && <div className="lb-pod__crown">👑</div>}
                    <div className="lb-pod__avatar-wrap" style={{ '--acolor': color }}>
                      <div className="lb-pod__avatar"><Avatar user={p} /></div>
                      <div className="lb-pod__rank-badge" style={{ background: color }}>{p.rank}</div>
                    </div>
                    <p className="lb-pod__name">{p.name.split(' ')[0]}</p>
                    <p className="lb-pod__pts">{p.points.toLocaleString()} <span>pts</span></p>
                    <p className="lb-pod__level">{p.level_title}</p>
                  </div>
                  <div className="lb-pod__block" style={{ height: podiumH, '--acolor': color }} />
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <div className="lb-list">
        {loading
          ? <p style={{ color: 'var(--color-text-muted)', padding: '24px', textAlign: 'center' }}>Loading...</p>
          : error
            ? <p style={{ color: '#ef4444', padding: '24px', textAlign: 'center' }}>{error}</p>
            : players.length === 0
            ? <p style={{ color: 'var(--color-text-muted)', padding: '24px', textAlign: 'center' }}>No data for this period yet.</p>
            : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                >
                  {players.map(p => (
                    <motion.div
                      key={p.id}
                      className={`lb-row${p.rank <= 3 ? ' lb-row--top' : ''}`}
                      variants={rowVariants}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="lb-row__rank">
                        {p.rank <= 3
                          ? <RankIcon rank={p.rank} />
                          : <span className="lb-row__rank-num">{p.rank}</span>
                        }
                      </div>
                      <div className="lb-row__avatar" style={{ '--acolor': '#6C63FF' }}>
                        <Avatar user={p} />
                      </div>
                      <div className="lb-row__info">
                        <div className="lb-row__top-line">
                          <span className="lb-row__name">{p.name}</span>
                        </div>
                        <div className="lb-row__progress-wrap">
                          <div className="lb-row__progress-bar">
                            <motion.div
                              className="lb-row__progress-fill"
                              style={{ '--acolor': '#6C63FF' }}
                              initial={{ width: 0 }}
                              animate={{ width: `${p.progress}%` }}
                              transition={{ duration: 0.8, delay: 0.2 + p.rank * 0.05, ease: 'easeOut' }}
                            />
                          </div>
                          <span className="lb-row__level-tag" style={{ color: '#6C63FF' }}>{p.level_title}</span>
                        </div>
                      </div>
                      <div className="lb-row__stats">
                        <div className="lb-row__stat">
                          <span className="lb-row__stat-val">{p.points.toLocaleString()}</span>
                          <span className="lb-row__stat-lbl">pts</span>
                        </div>
                        <div className="lb-row__stat">
                          <span className="lb-row__stat-val">{p.labs_solved}</span>
                          <span className="lb-row__stat-lbl">labs</span>
                        </div>
                        <div className="lb-row__stat lb-row__stat--streak">
                          <Flame size={12} />
                          <span className="lb-row__stat-val">{p.current_streak}d</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )
        }
      </div>
    </div>
  )
}
