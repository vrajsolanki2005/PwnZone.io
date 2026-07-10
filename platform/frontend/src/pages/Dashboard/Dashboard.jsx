import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import GradientText from '../../components/ui/GradientText'
import TextScramble from '../../components/ui/TextScramble'
import { Trophy, Target, CheckCircle, TrendingUp, Sparkles, AlertCircle } from 'lucide-react'
import { progressApi, leaderboardApi } from '../../services/api'
import './Dashboard.css'

const XP_PER_POINT = 1
const LEVEL_THRESHOLDS = [0, 500, 1000, 2000, 3500, 5000, 7500, 10000, 15000, 20000]

function getLevel(points) {
  let level = 1
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i]) level = i + 1
    else break
  }
  return level
}

function getLevelBounds(level) {
  const current = LEVEL_THRESHOLDS[level - 1] || 0
  const next    = LEVEL_THRESHOLDS[level]     || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  return { current, next }
}

const LEVEL_TITLES = ['','Rookie','Script Kiddie','Apprentice','Explorer','Hacker','Senior Hacker','Elite Hacker','Master Hacker','Legend','God Mode']

const PRIORITY_COLORS = { P1: '#ef4444', P2: '#FF9F43', P3: '#eab308', P4: '#22C55E' }

export default function Dashboard() {
  const { user }                            = useAuth()
  const [stats,         setStats]         = useState(null)
  const [recent,        setRecent]        = useState([])
  const [recommended,   setRecommended]   = useState([])
  const [leaderboard,   setLeaderboard]   = useState([])
  const [rank,          setRank]          = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const navigate = useNavigate()

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, recentRes, recsRes, lbRes] = await Promise.all([
        progressApi.stats(),
        progressApi.recent(),
        progressApi.recommendations(),
        leaderboardApi.get('all'),
      ])
      setStats(statsRes.data)
      setRecent(recentRes.data)
      setRecommended(recsRes.data)
      const all = lbRes.data
      setLeaderboard(all.slice(0, 5))
      if (user?.id) {
        const entry = all.find(x => x.id === user.id)
        if (entry) setRank(entry.rank)
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchData()
    window.addEventListener('flag:submitted', fetchData)
    window.addEventListener('focus', fetchData)
    return () => {
      window.removeEventListener('flag:submitted', fetchData)
      window.removeEventListener('focus', fetchData)
    }
  }, [fetchData])

  const points  = stats?.total_points   || 0
  const solved  = stats?.total_completed || 0
  const total   = stats?.total_labs      || 0
  const successRate = total ? Math.round((solved / total) * 100) : 0
  const level   = getLevel(points)
  const { current: lvlStart, next: lvlEnd } = getLevelBounds(level)
  const xpInLevel = points - lvlStart
  const xpNeeded  = lvlEnd - lvlStart

  const STATS = [
    { label: 'Total Points',  value: points.toLocaleString(), icon: Trophy,      color: '#f59e0b' },
    { label: 'Current Rank',  value: rank ? `#${rank}` : '#--', icon: TrendingUp,  color: '#3b82f6' },
    { label: 'Labs Solved',   value: String(solved),          icon: Target,      color: '#10b981' },
    { label: 'Success Rate',  value: `${successRate}%`,       icon: CheckCircle, color: '#7c6af7' },
  ]

  const weekDays = ['M','T','W','T','F','S','S']
  // reorderedDays is Mon(0)...Sun(6), index 0=Mon, 6=Sun
  const reorderedDays = [...weekDays.slice(1), weekDays[0]]
  // todayDow: 0=Mon ... 6=Sun
  const todayDow = (new Date().getDay() + 6) % 7
  const currentStreak = stats?.current_streak || 0

  if (loading) return <div className="dashboard-state">Loading dashboard...</div>
  if (error)   return (
    <div className="dashboard-state dashboard-state--error">
      <AlertCircle size={18} /> {error}
    </div>
  )

  return (
    <div className="dashboard">
      <div className="dashboard-header"><h1>Dashboard</h1></div>
      <div className="dashboard-welcome">
        <GradientText className="dashboard-sub" animationSpeed={6} direction="horizontal" pauseOnHover>
          Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Continue Your Journey
        </GradientText>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        {STATS.map(stat => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}18`, color: stat.color }}>
              <stat.icon size={20} />
            </div>
            <div className="stat-info">
              <TextScramble className="stat-value" duration={0.8} speed={0.04}>{stat.value}</TextScramble>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress + Streak */}
      <section className="progress-streak-wrapper">
        <div className="progress-section">
          <div className="xp-header">
            <h2>Overall Progress</h2>
            <span className="xp-level-badge">Lvl {level}</span>
          </div>
          <div className="xp-title-row">
            <span className="xp-rank-title">{LEVEL_TITLES[level]}</span>
            <span className="xp-arrow">→</span>
            <span className="xp-rank-next">{LEVEL_TITLES[level + 1] || 'MAX'}</span>
          </div>
          <div className="xp-bar-wrap">
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${Math.min((xpInLevel / xpNeeded) * 100, 100)}%` }} />
              <span className="xp-bar-glow" style={{ left: `${Math.min((xpInLevel / xpNeeded) * 100, 100)}%` }} />
            </div>
            <div className="xp-bar-labels">
              <span className="xp-current">{points.toLocaleString()} pts</span>
              <span className="xp-needed">{(xpNeeded - xpInLevel).toLocaleString()} pts to next level</span>
              <span className="xp-next">{lvlEnd.toLocaleString()} pts</span>
            </div>
          </div>
          <div className="xp-milestones">
            {LEVEL_THRESHOLDS.slice(1, 6).map(m => (
              <div key={m} className={`xp-milestone${points >= m ? ' reached' : ''}`}>
                <div className="xp-milestone-dot" />
                <span className="xp-milestone-label">{m >= 1000 ? `${m/1000}k` : m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="streak-section">
          <h2>Current Streak</h2>
          <div className="streak-card">
            <div className="streak-top">
              <span className="streak-icon">🔥</span>
              <div className="streak-count">
                <span className="streak-number">{currentStreak}</span>
                <span className="streak-unit">day streak</span>
              </div>
            </div>
            <div className="streak-days">
              {reorderedDays.map((day, i) => {
                // i is the day index (0=Mon...6=Sun)
                // active if this day is within the streak window ending at today
                const daysFromToday = todayDow - i
                const active = daysFromToday >= 0 && daysFromToday < currentStreak
                return (
                  <div key={i} className="streak-day">
                    <div className={`streak-dot${active ? ' active' : ''}`} />
                    <span className="streak-day-label">{day}</span>
                  </div>
                )
              })}
            </div>
            <div className="streak-stats">
              <div className="streak-stat">
                <span className="streak-stat-value">{stats?.current_streak || 0}</span>
                <span className="streak-stat-label">Current</span>
              </div>
              <div className="streak-stat-divider" />
              <div className="streak-stat">
                <span className="streak-stat-value">{stats?.max_streak || 0}</span>
                <span className="streak-stat-label">Max</span>
              </div>
              <div className="streak-stat-divider" />
              <div className="streak-stat">
                <span className="streak-stat-value">{solved}</span>
                <span className="streak-stat-label">Total Labs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Completions as Continue Learning */}
      {recent.length > 0 && (
        <section className="continue-learning">
          <h2>Recent Completions</h2>
          <div className="cl-grid">
            {recent.map(item => {
              const color = PRIORITY_COLORS[item.difficulty] || '#7c6af7'
              return (
                <div key={item.slug} className="cl-card">
                  <div className="cl-card-banner" style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)`, borderBottom: `1px solid ${color}30` }}>
                    <div className="cl-ring-wrap">
                      <svg viewBox="0 0 64 64" className="cl-ring">
                        <circle cx="32" cy="32" r="26" fill="none" stroke="var(--color-border)" strokeWidth="5" />
                        <circle cx="32" cy="32" r="26" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 26}`} strokeDashoffset="0" transform="rotate(-90 32 32)" />
                      </svg>
                      <span className="cl-ring-pct" style={{ color }}>100%</span>
                    </div>
                    <span className="cl-tag" style={{ background: `${color}22`, color }}>Completed</span>
                  </div>
                  <div className="cl-card-body">
                    <p className="cl-title">{item.title}</p>
                    <p className="cl-meta">+{item.points_earned} pts · {item.difficulty}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Recommended Labs */}
      {recommended.length > 0 && (
        <section className="recommendations">
          <div className="rec-header">
            <div className="rec-title">
              <Sparkles size={18} className="rec-icon" />
              <h2>Recommended for You</h2>
            </div>
            <a href="/labs" className="rec-view-all">View All Labs →</a>
          </div>
          <div className="rec-grid">
            {recommended.map(lab => {
              const color = PRIORITY_COLORS[lab.difficulty] || '#7c6af7'
              return (
                <div key={lab.id} className="rec-card" onClick={() => navigate(`/labs/${lab.slug}`)}>
                  <div className="rec-card__top">
                    <span className="rec-card__priority" style={{ background: `${color}18`, color }}>
                      {lab.difficulty}
                    </span>
                    <span className="rec-card__points">🏆 {lab.points} pts</span>
                  </div>
                  <p className="rec-card__title">{lab.title}</p>
                  <span className="rec-card__category">{lab.category}</span>
                  <div className="rec-card__footer" style={{ borderTop: `1px solid ${color}22` }}>
                    <span className="rec-card__cta" style={{ color }}>Start Lab →</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Leaderboard Preview */}
      <section className="leaderboard-preview">
        <div className="lb-header">
          <h2>Leaderboard</h2>
          <a href="/leaderboard" className="lb-view-all">View Full Leaderboard →</a>
        </div>

        {leaderboard.length >= 3 && (() => {
          const [first, second, third] = [leaderboard[0], leaderboard[1], leaderboard[2]]
          const podium = [second, first, third].filter(Boolean)
          const colors  = ['#C0C0C0', '#FFD700', '#CD7F32']
          const heights = ['80px', '100px', '64px']
          return (
            <div className="lb-podium">
              {podium.map((u, i) => (
                <div key={u.id} className={`lb-podium-item${i === 1 ? ' lb-podium-first' : ''}`}>
                  <div className="lb-avatar" style={{ borderColor: colors[i] }}>{u.name.charAt(0)}</div>
                  <span className="lb-podium-name">{u.name.split(' ')[0]}</span>
                  <span className="lb-podium-score">{u.points.toLocaleString()}</span>
                  <div className="lb-podium-block" style={{ height: heights[i], background: `${colors[i]}18`, borderTop: `3px solid ${colors[i]}` }}>
                    <span className="lb-podium-rank" style={{ color: colors[i] }}>#{u.rank}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        })()}

        <div className="lb-list">
          {leaderboard.slice(3).map(u => (
            <div key={u.id} className="lb-row">
              <span className="lb-row-rank">#{u.rank}</span>
              <div className="lb-row-avatar">{u.name.charAt(0)}</div>
              <span className="lb-row-name">{u.name}</span>
              <span className="lb-row-score">{u.points.toLocaleString()} pts</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
