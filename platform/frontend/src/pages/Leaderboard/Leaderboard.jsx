import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Crown, Medal, Award } from 'lucide-react'
import './Leaderboard.css'

const TABS = ['Weekly', 'Monthly', 'All Time']

const PLAYERS = [
  { rank: 1,  name: 'Jay Shah',       handle: '@jayshah',      avatar: 'JS', points: 15200, labs: 58, streak: 31, level: 'Elite Hacker',    color: '#FFD700', progress: 92 },
  { rank: 2,  name: 'Vraj Solanki',   handle: '@vrajsol',      avatar: 'VS', points: 14500, labs: 54, streak: 22, level: 'Pro Hacker',      color: '#C0C0C0', progress: 87 },
  { rank: 3,  name: 'Vatsal Thummar', handle: '@vatsal_t',     avatar: 'VT', points: 13800, labs: 51, streak: 18, level: 'Pro Hacker',      color: '#CD7F32', progress: 82 },
  { rank: 4,  name: 'Hackman',        handle: '@hackman',      avatar: 'HM', points: 12900, labs: 48, streak: 14, level: 'Advanced',        color: '#6C63FF', progress: 76 },
  { rank: 5,  name: 'Mohanlal',       handle: '@mohan_l',      avatar: 'ML', points: 12480, labs: 45, streak: 12, level: 'Advanced',        color: '#6C63FF', progress: 74 },
  { rank: 6,  name: 'RootShell',      handle: '@rootshell',    avatar: 'RS', points: 11750, labs: 43, streak: 9,  level: 'Intermediate',    color: '#60A5FA', progress: 70 },
  { rank: 7,  name: 'NullByte',       handle: '@nullbyte',     avatar: 'NB', points: 11200, labs: 41, streak: 7,  level: 'Intermediate',    color: '#60A5FA', progress: 67 },
  { rank: 8,  name: 'CipherX',        handle: '@cipherx',      avatar: 'CX', points: 10800, labs: 39, streak: 5,  level: 'Intermediate',    color: '#60A5FA', progress: 64 },
  { rank: 9,  name: 'XploitDev',      handle: '@xploitdev',    avatar: 'XD', points: 10100, labs: 37, streak: 4,  level: 'Beginner',        color: '#22C55E', progress: 60 },
  { rank: 10, name: 'PayloadPro',     handle: '@payloadpro',   avatar: 'PP', points: 9600,  labs: 35, streak: 3,  level: 'Beginner',        color: '#22C55E', progress: 57 },
]

const PODIUM = [PLAYERS[1], PLAYERS[0], PLAYERS[2]] // silver, gold, bronze

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

export default function Leaderboard() {
  const [tab, setTab] = useState('All Time')

  return (
    <div className="lb-page">

      {/* Hero header */}
      <div className="lb-hero">
        <div className="lb-hero__glow" />
        <div className="lb-hero__content">
          <span className="lb-hero__eyebrow"><Flame size={14} /> Live Rankings</span>
          <h1 className="lb-hero__title">Leaderboard</h1>
          <p className="lb-hero__sub">Compete. Hack. Dominate the ranks.</p>
        </div>

        {/* Tabs */}
        <div className="lb-tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={`lb-tab${tab === t ? ' lb-tab--active' : ''}`}
              onClick={() => setTab(t)}
            >
              {tab === t && <motion.div className="lb-tab__bg" layoutId="lb-tab-bg" />}
              <span>{t}</span>
            </button>
          ))}
        </div>

        {/* Podium */}
        <div className="lb-podium">
          {PODIUM.map((p, i) => {
            const isGold = p.rank === 1
            const podiumH = [100, 130, 80][i]
            return (
              <motion.div
                key={p.rank}
                className={`lb-pod${isGold ? ' lb-pod--gold' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: 'easeOut' }}
              >
                <div className="lb-pod__meta">
                  {isGold && <div className="lb-pod__crown">👑</div>}
                  <div className="lb-pod__avatar-wrap" style={{ '--acolor': p.color }}>
                    <div className="lb-pod__avatar">{p.avatar}</div>
                    <div className="lb-pod__rank-badge" style={{ background: p.color }}>
                      {p.rank}
                    </div>
                  </div>
                  <p className="lb-pod__name">{p.name.split(' ')[0]}</p>
                  <p className="lb-pod__pts">{p.points.toLocaleString()} <span>pts</span></p>
                  <p className="lb-pod__level">{p.level}</p>
                </div>
                <div className="lb-pod__block" style={{ height: podiumH, '--acolor': p.color }} />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Ranked list */}
      <div className="lb-list">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          >
            {PLAYERS.map(p => (
              <motion.div
                key={p.rank}
                className={`lb-row${p.rank <= 3 ? ' lb-row--top' : ''}`}
                variants={rowVariants}
                whileHover={{ scale: 1.01 }}
              >
                {/* Rank */}
                <div className="lb-row__rank">
                  {p.rank <= 3
                    ? <RankIcon rank={p.rank} />
                    : <span className="lb-row__rank-num">{p.rank}</span>
                  }
                </div>

                {/* Avatar */}
                <div className="lb-row__avatar" style={{ '--acolor': p.color }}>
                  {p.avatar}
                </div>

                {/* Info */}
                <div className="lb-row__info">
                  <div className="lb-row__top-line">
                    <span className="lb-row__name">{p.name}</span>
                    <span className="lb-row__handle">{p.handle}</span>
                  </div>
                  <div className="lb-row__progress-wrap">
                    <div className="lb-row__progress-bar">
                      <motion.div
                        className="lb-row__progress-fill"
                        style={{ '--acolor': p.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${p.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + p.rank * 0.05, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="lb-row__level-tag" style={{ color: p.color }}>{p.level}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="lb-row__stats">
                  <div className="lb-row__stat">
                    <span className="lb-row__stat-val">{p.points.toLocaleString()}</span>
                    <span className="lb-row__stat-lbl">pts</span>
                  </div>
                  <div className="lb-row__stat">
                    <span className="lb-row__stat-val">{p.labs}</span>
                    <span className="lb-row__stat-lbl">labs</span>
                  </div>
                  <div className="lb-row__stat lb-row__stat--streak">
                    <Flame size={12} />
                    <span className="lb-row__stat-val">{p.streak}d</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
