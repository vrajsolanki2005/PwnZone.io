import GradientText from "../../components/ui/GradientText";
import TextScramble from "../../components/ui/TextScramble";
import { Trophy, Target, CheckCircle, TrendingUp } from "lucide-react";
import "./Dashboard.css";

const STATS = [
  { label: "Total Points", value: "12,480", icon: Trophy, color: "#f59e0b" },
  { label: "Current Rank", value: "#42", icon: TrendingUp, color: "#3b82f6" },
  { label: "Labs Solved", value: "87", icon: Target, color: "#10b981" },
  { label: "Success Rate", value: "91%", icon: CheckCircle, color: "#7c6af7" },
];

const XP = {
  // TODO: fetch from DB — /api/user/xp
  current: 3240,
  next: 5000,
  level: 7,
  title: 'Elite Hacker',
  nextTitle: 'Master Hacker',
}

const CONTINUE = [
  {
    label: "SQL Injection",
    value: 70,
    color: "#7c6af7",
    lessons: 12,
    duration: "4h 20m",
  },
  {
    label: "Buffer Overflow",
    value: 45,
    color: "#3b82f6",
    lessons: 9,
    duration: "3h 10m",
  },
  { label: "XSS", value: 30, color: "#10b981", lessons: 8, duration: "2h 45m" },
  {
    label: "CSRF",
    value: 20,
    color: "#f59e0b",
    lessons: 6,
    duration: "1h 50m",
  },
  {
    label: "Privilege Escalation",
    value: 28,
    color: "#ef4444",
    lessons: 14,
    duration: "5h 00m",
  },
];

const LEADERBOARD = [
  { id: 1, name: "Jay Shah", score: "15,200", rank: "#1" },
  { id: 2, name: "Vraj Solanki", score: "14,500", rank: "#2" },
  { id: 3, name: "Vatsal Thummar", score: "13,800", rank: "#3" },
  { id: 4, name: "Mohanlal", score: "12,900", rank: "#4" },
  { id: 5, name: "Hackman", score: "12,480", rank: "#5" },
];
export default function Dashboard() {
  return (
    <div className="dashboard">
      {/* Header Section  */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>
      <div className="dashboard-welcome">
        <GradientText
          className="dashboard-sub"
          animationSpeed={6}
          direction="horizontal"
          pauseOnHover
        >
          Continue Your Journey
        </GradientText>
      </div>

      {/* Stats Section */}
      <div className="dashboard-stats">
        {STATS.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div
              className="stat-icon"
              style={{ background: `${stat.color}18`, color: stat.color }}
            >
              <stat.icon size={20} />
            </div>
            <div className="stat-info">
              <TextScramble className="stat-value" duration={0.8} speed={0.04}>
                {stat.value}
              </TextScramble>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <section className="progress-streak-wrapper">
        {/* XP Progress section */}
        <div className="progress-section">
          <div className="xp-header">
            <h2>Overall Progress</h2>
            <span className="xp-level-badge">Lvl {XP.level}</span>
          </div>

          <div className="xp-title-row">
            <span className="xp-rank-title">{XP.title}</span>
            <span className="xp-arrow">→</span>
            <span className="xp-rank-next">{XP.nextTitle}</span>
          </div>

          <div className="xp-bar-wrap">
            <div className="xp-bar-track">
              <div
                className="xp-bar-fill"
                style={{ width: `${(XP.current / XP.next) * 100}%` }}
              />
              <span className="xp-bar-glow" style={{ left: `${(XP.current / XP.next) * 100}%` }} />
            </div>
            <div className="xp-bar-labels">
              <span className="xp-current">{XP.current.toLocaleString()} XP</span>
              <span className="xp-needed">{(XP.next - XP.current).toLocaleString()} XP to next level</span>
              <span className="xp-next">{XP.next.toLocaleString()} XP</span>
            </div>
          </div>

          <div className="xp-milestones">
            {[1000, 2000, 3000, 4000, 5000].map((milestone) => (
              <div
                key={milestone}
                className={`xp-milestone${XP.current >= milestone ? ' reached' : ''}`}
              >
                <div className="xp-milestone-dot" />
                <span className="xp-milestone-label">{milestone / 1000}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* streak section */}
        <div className="streak-section">
          {/* TODO: fetch from DB — /api/user/streak */}
          <h2>Current Streak</h2>
          <div className="streak-card">
            <div className="streak-top">
              <span className="streak-icon">🔥</span>
              <div className="streak-count">
                <span className="streak-number">14</span>
                <span className="streak-unit">day streak</span>
              </div>
            </div>

            <div className="streak-days">
              {['M','T','W','T','F','S','S'].map((day, i) => (
                <div key={i} className="streak-day">
                  <div className={`streak-dot${i < 5 ? ' active' : ''}`} />
                  <span className="streak-day-label">{day}</span>
                </div>
              ))}
            </div>

            <div className="streak-stats">
              <div className="streak-stat">
                <span className="streak-stat-value">14</span>
                <span className="streak-stat-label">Current</span>
              </div>
              <div className="streak-stat-divider" />
              <div className="streak-stat">
                <span className="streak-stat-value">31</span>
                <span className="streak-stat-label">Max</span>
              </div>
              <div className="streak-stat-divider" />
              <div className="streak-stat">
                <span className="streak-stat-value">142</span>
                <span className="streak-stat-label">Total</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Continue learning */}
      <section className="continue-learning">
        <h2>Continue Learning</h2>
        <div className="cl-grid">
          {CONTINUE.map((item) => (
            <div key={item.label} className="cl-card">
              <div
                className="cl-card-banner"
                style={{
                  background: `linear-gradient(135deg, ${item.color}33, ${item.color}11)`,
                  borderBottom: `1px solid ${item.color}30`,
                }}
              >
                <div className="cl-ring-wrap">
                  <svg viewBox="0 0 64 64" className="cl-ring">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="var(--color-border)"
                      strokeWidth="5"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      strokeDashoffset={`${2 * Math.PI * 26 * (1 - item.value / 100)}`}
                      transform="rotate(-90 32 32)"
                    />
                  </svg>
                  <span className="cl-ring-pct" style={{ color: item.color }}>
                    {item.value}%
                  </span>
                </div>
                <span
                  className="cl-tag"
                  style={{ background: `${item.color}22`, color: item.color }}
                >
                  In Progress
                </span>
              </div>
              <div className="cl-card-body">
                <p className="cl-title">{item.label} Lab</p>
                <p className="cl-meta">
                  {item.lessons} lessons · {item.duration}
                </p>
                {/* <div className="cl-progress-row">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${item.value}%`, background: item.color }} />
                  </div>
                  <span className="cl-pct">{item.value}%</span>
                </div> */}
                <button
                  className="cl-btn"
                  style={{ "--btn-color": item.color }}
                >
                  Continue
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="leaderboard-preview">
        <div className="lb-header">
          <h2>Leaderboard</h2>
          <a href="/leaderboard" className="lb-view-all">
            View Full Leaderboard →
          </a>
        </div>

        {/* Top 3 podium */}
        <div className="lb-podium">
          {LEADERBOARD.slice(0, 3).map((user, i) => {
            const order = [1, 0, 2];
            const heights = ["80px", "100px", "64px"];
            const colors = ["#C0C0C0", "#FFD700", "#CD7F32"];
            const u = LEADERBOARD[order[i]];
            return (
              <div
                key={u.id}
                className={`lb-podium-item${order[i] === 0 ? " lb-podium-first" : ""}`}
              >
                <div className="lb-avatar" style={{ borderColor: colors[i] }}>
                  {u.name.charAt(0)}
                </div>
                <span className="lb-podium-name">{u.name.split(" ")[0]}</span>
                <span className="lb-podium-score">{u.score}</span>
                <div
                  className="lb-podium-block"
                  style={{
                    height: heights[i],
                    background: `${colors[i]}18`,
                    borderTop: `3px solid ${colors[i]}`,
                  }}
                >
                  <span className="lb-podium-rank" style={{ color: colors[i] }}>
                    {u.rank}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rows 4–5 */}
        <div className="lb-list">
          {LEADERBOARD.slice(3).map((user) => (
            <div key={user.id} className="lb-row">
              <span className="lb-row-rank">{user.rank}</span>
              <div className="lb-row-avatar">{user.name.charAt(0)}</div>
              <span className="lb-row-name">{user.name}</span>
              <span className="lb-row-score">{user.score} pts</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
