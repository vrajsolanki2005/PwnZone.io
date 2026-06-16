import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Palette, Bell, Shield, Trash2, Sun, Moon, Check, Eye, EyeOff, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../services/api'
import './Settings.css'

const SECTIONS = [
  { key: 'profile',       label: 'Profile',       icon: User },
  { key: 'appearance',    label: 'Appearance',    icon: Palette },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security',      label: 'Security',      icon: Shield },
  { key: 'critical',      label: 'Criical Actions',   icon: Trash2, danger: true },
]

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

function Toggle({ checked, onChange }) {
  return (
    <button className={`st-toggle${checked ? ' st-toggle--on' : ''}`} onClick={() => onChange(!checked)}>
      <motion.div className="st-toggle__thumb" layout transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
    </button>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="st-field">
      <div className="st-field__label">
        <span>{label}</span>
        {hint && <span className="st-field__hint">{hint}</span>}
      </div>
      <div className="st-field__control">{children}</div>
    </div>
  )
}

function SectionCard({ title, desc, children }) {
  return (
    <motion.div className="st-card" variants={fadeUp}>
      <div className="st-card__header">
        <h2 className="st-card__title">{title}</h2>
        {desc && <p className="st-card__desc">{desc}</p>}
      </div>
      <div className="st-card__body">{children}</div>
    </motion.div>
  )
}

/* ── Section components ─────────────────────────────────── */

function ProfileSection() {
  const [form, setForm] = useState({ name: 'Jay Shah', handle: 'jayshah', email: 'jay@example.com', bio: 'Bug hunter · CTF player · Breaking things for fun and profit.', location: 'Ahmedabad, IN' })
  const [saved, setSaved] = useState(false)

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <SectionCard title="Public Profile" desc="This information will be visible to other users.">
      <div className="st-avatar-row">
        <div className="st-avatar">JS</div>
        <div>
          <button className="st-btn st-btn--secondary">Change Avatar</button>
          <p className="st-avatar-hint">JPG, PNG or GIF · max 2MB</p>
        </div>
      </div>

      <div className="st-form">
        {[
          { key: 'name',     label: 'Display Name',  type: 'text' },
          { key: 'handle',   label: 'Username',       type: 'text', prefix: '@' },
          { key: 'email',    label: 'Email',          type: 'email' },
          { key: 'location', label: 'Location',       type: 'text' },
        ].map(f => (
          <div key={f.key} className="st-input-wrap">
            <label className="st-label">{f.label}</label>
            <div className={`st-input-row${f.prefix ? ' has-prefix' : ''}`}>
              {f.prefix && <span className="st-input-prefix">{f.prefix}</span>}
              <input
                className="st-input"
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              />
            </div>
          </div>
        ))}

        <div className="st-input-wrap">
          <label className="st-label">Bio</label>
          <textarea
            className="st-input st-textarea"
            rows={3}
            value={form.bio}
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
          />
        </div>
      </div>

      <div className="st-card__footer">
        <button className="st-btn st-btn--primary" onClick={save}>
          {saved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
        </button>
      </div>
    </SectionCard>
  )
}

function AppearanceSection() {
  const { theme, toggle } = useTheme()
  const [accent, setAccent] = useState('purple')

  const ACCENTS = [
    { key: 'purple', color: '#6C63FF' },
    { key: 'blue',   color: '#3B82F6' },
    { key: 'green',  color: '#22C55E' },
    { key: 'pink',   color: '#EC4899' },
    { key: 'orange', color: '#FF9F43' },
  ]

  return (
    <SectionCard title="Appearance" desc="Customize how the platform looks for you.">
      <Field label="Theme" hint="Changes apply instantly">
        <div className="st-theme-btns">
          <button className={`st-theme-btn${theme === 'light' ? ' active' : ''}`} onClick={() => theme === 'dark' && toggle()}>
            <Sun size={16} /> Light
          </button>
          <button className={`st-theme-btn${theme === 'dark' ? ' active' : ''}`} onClick={() => theme === 'light' && toggle()}>
            <Moon size={16} /> Dark
          </button>
        </div>
      </Field>

      <Field label="Accent Color">
        <div className="st-accents">
          {ACCENTS.map(a => (
            <button
              key={a.key}
              className={`st-accent-dot${accent === a.key ? ' active' : ''}`}
              style={{ background: a.color }}
              onClick={() => setAccent(a.key)}
            >
              {accent === a.key && <Check size={12} color="#fff" />}
            </button>
          ))}
        </div>
      </Field>
    </SectionCard>
  )
}

function NotificationsSection() {
  const [notifs, setNotifs] = useState({
    labCompleted:   true,
    newLabs:        true,
    leaderboard:    false,
    achievements:   true,
    weeklyDigest:   false,
    emailUpdates:   true,
  })

  const toggle = key => setNotifs(p => ({ ...p, [key]: !p[key] }))

  const ITEMS = [
    { key: 'labCompleted', label: 'Lab Completed',      desc: 'When you finish a lab' },
    { key: 'newLabs',      label: 'New Labs Available', desc: 'When new labs are added' },
    { key: 'leaderboard',  label: 'Rank Changes',       desc: 'When your rank changes' },
    { key: 'achievements', label: 'Achievements',       desc: 'When you earn a badge' },
    { key: 'weeklyDigest', label: 'Weekly Digest',      desc: 'Weekly summary email' },
    { key: 'emailUpdates', label: 'Email Updates',      desc: 'Product news & updates' },
  ]

  return (
    <SectionCard title="Notifications" desc="Choose what you want to be notified about.">
      <div className="st-notif-list">
        {ITEMS.map(item => (
          <div key={item.key} className="st-notif-row">
            <div>
              <p className="st-notif-label">{item.label}</p>
              <p className="st-notif-desc">{item.desc}</p>
            </div>
            <Toggle checked={notifs[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function SecuritySection() {
  const [showPass, setShowPass] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await authApi.logout()
      logout()
      navigate('/login')
    } catch {
      toast.error('Logout failed. Please try again.')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <>
      <SectionCard title="Change Password" desc="Use a strong password you don't use elsewhere.">
        <div className="st-form">
          {['Current Password', 'New Password', 'Confirm Password'].map(l => (
            <div key={l} className="st-input-wrap">
              <label className="st-label">{l}</label>
              <div className="st-input-row st-input-row--icon">
                <input className="st-input" type={showPass ? 'text' : 'password'} placeholder="••••••••" />
                <button className="st-input-eye" onClick={() => setShowPass(p => !p)}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="st-card__footer">
          <button className="st-btn st-btn--primary" onClick={save}>
            {saved ? <><Check size={14} /> Updated!</> : 'Update Password'}
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" desc="Add an extra layer of security to your account.">
        <Field label="Enable 2FA" hint={twoFA ? 'Active' : 'Inactive'}>
          <Toggle checked={twoFA} onChange={setTwoFA} />
        </Field>
        <AnimatePresence>
          {twoFA && (
            <motion.div
              className="st-2fa-info"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p>🔐 2FA is enabled. Use an authenticator app to generate codes.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCard>
      <SectionCard title="Sessions" desc="Manage your active sessions and sign out securely.">
        <Field label="Current Session" hint="Active now">
          <button className="st-btn st-btn--danger" onClick={handleLogout} disabled={loggingOut}>
            <LogOut size={14} />
            {loggingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </Field>
        <Field label="Sign Out Everywhere" hint="Invalidates all tokens on all devices">
          <button className="st-btn st-btn--warning" onClick={handleLogout} disabled={loggingOut}>
            <LogOut size={14} />
            {loggingOut ? 'Signing out...' : 'Sign Out All Devices'}
          </button>
        </Field>
      </SectionCard>
    </>
  )
}

function DangerSection() {
  const [confirm, setConfirm] = useState('')
  return (
    <motion.div className="st-card st-card--danger" variants={fadeUp}>
      <div className="st-card__header">
        <h2 className="st-card__title st-card__title--danger">Danger Zone</h2>
        <p className="st-card__desc">These actions are irreversible. Please proceed with caution.</p>
      </div>
      <div className="st-card__body">
        <div className="st-danger-row">
          <div>
            <p className="st-danger-label">Export Data</p>
            <p className="st-danger-desc">Download all your lab results and progress.</p>
          </div>
          <button className="st-btn st-btn--secondary">Export</button>
        </div>

        <div className="st-danger-divider" />

        <div className="st-danger-row">
          <div>
            <p className="st-danger-label">Reset Progress</p>
            <p className="st-danger-desc">Wipe all solved labs and points. Cannot be undone.</p>
          </div>
          <button className="st-btn st-btn--warning">Reset</button>
        </div>

        <div className="st-danger-divider" />

        <div className="st-danger-delete">
          <p className="st-danger-label">Delete Account</p>
          <p className="st-danger-desc">Type <strong>DELETE</strong> to confirm permanent account deletion.</p>
          <div className="st-danger-confirm-row">
            <input
              className="st-input st-input--danger"
              placeholder="Type DELETE to confirm"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
            <button className="st-btn st-btn--danger" disabled={confirm !== 'DELETE'}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export default function Settings() {
  const [active, setActive] = useState('profile')

  const CONTENT = {
    profile:       <ProfileSection />,
    appearance:    <AppearanceSection />,
    notifications: <NotificationsSection />,
    security:      <SecuritySection />,
    danger:        <DangerSection />,
  }

  return (
    <div className="st-page">
      <h1>Settings</h1>

      <div className="st-layout">
        {/* Sidebar nav */}
        <nav className="st-nav">
          {SECTIONS.map(s => (
            <button
              key={s.key}
              className={`st-nav__item${active === s.key ? ' active' : ''}${s.danger ? ' danger' : ''}`}
              onClick={() => setActive(s.key)}
            >
              {active === s.key && <motion.div className="st-nav__indicator" layoutId="st-nav-indicator" />}
              <s.icon size={16} />
              <span>{s.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="st-content"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            {CONTENT[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
