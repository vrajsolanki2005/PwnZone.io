import { useState, useEffect, useCallback } from 'react'
import { Users, FlaskConical, BarChart3, Trash2, RotateCcw, Pencil, Plus, X, Check, ShieldCheck, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi } from '../../services/api'
import './AdminPanel.css'

const DIFFICULTIES = ['P1', 'P2', 'P3', 'P4']
const CATEGORIES = [
  'API Security',
  'Authentication & Session Management',
  'Broken Access Control',
  'Business Logic',
  'Client-Side Vulnerabilities',
  'File Handling Vulnerabilities',
  'Injection',
  'Reconnaissance & Asset Discovery',
  'Server-Side Vulnerabilities',
  'Software Supply Chain',
]
const DIFF_COLORS = { P1: '#ef4444', P2: '#FF9F43', P3: '#eab308', P4: '#22C55E' }

/* ── Confirm Dialog ─────────────────────────────────────── */
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="adm-overlay">
      <div className="adm-dialog">
        <p className="adm-dialog__msg">{message}</p>
        <div className="adm-dialog__actions">
          <button className="adm-btn adm-btn--secondary" onClick={onCancel}>Cancel</button>
          <button className="adm-btn adm-btn--danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

/* ── Stats Overview ─────────────────────────────────────── */
function Overview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getStats()
      .then(r => setStats(r.data))
      .catch(() => toast.error('Failed to load stats.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="adm-state">Loading stats...</p>
  if (!stats)  return null

  const cards = [
    { label: 'Total Users',       value: stats.total_users,       icon: Users,        color: '#6C63FF' },
    { label: 'Total Labs',        value: stats.total_labs,        icon: FlaskConical, color: '#3b82f6' },
    { label: 'Total Completions', value: stats.total_completions, icon: Check,        color: '#22C55E' },
    { label: 'Points Awarded',    value: Number(stats.total_points).toLocaleString(), icon: BarChart3, color: '#f59e0b' },
    { label: 'New Users (7d)',    value: stats.new_users_week,    icon: Users,        color: '#ec4899' },
  ]

  return (
    <div className="adm-overview">
      <div className="adm-stats-grid">
        {cards.map(c => (
          <div key={c.label} className="adm-stat-card">
            <div className="adm-stat-icon" style={{ background: `${c.color}18`, color: c.color }}>
              <c.icon size={20} />
            </div>
            <div>
              <p className="adm-stat-value">{c.value}</p>
              <p className="adm-stat-label">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-card">
        <h3 className="adm-card__title">Top Labs by Solves</h3>
        <table className="adm-table">
          <thead>
            <tr><th>Title</th><th>Difficulty</th><th>Solves</th></tr>
          </thead>
          <tbody>
            {stats.top_labs.map((lab, i) => (
              <tr key={i}>
                <td>{lab.title}</td>
                <td><span className="adm-badge" style={{ color: DIFF_COLORS[lab.difficulty], background: `${DIFF_COLORS[lab.difficulty]}18` }}>{lab.difficulty}</span></td>
                <td>{lab.solves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Users Tab ──────────────────────────────────────────── */
function UsersTab() {
  const [users, setUsers]     = useState([])
  const [total, setTotal]     = useState(0)
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const [loading, setLoading] = useState(true)
  const [editUser, setEditUser] = useState(null)
  const [confirm, setConfirm]   = useState(null)
  const limit = 20

  const load = useCallback(() => {
    setLoading(true)
    adminApi.getUsers({ search, page, limit })
      .then(r => { setUsers(r.data.users); setTotal(r.data.total) })
      .catch(() => toast.error('Failed to load users.'))
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { load() }, [load])

  const handleDelete = (id) => {
    setConfirm({
      message: 'Permanently delete this user and all their data?',
      onConfirm: async () => {
        setConfirm(null)
        try { await adminApi.deleteUser(id); toast.success('User deleted.'); load() }
        catch { toast.error('Failed to delete user.') }
      },
    })
  }

  const handleResetProgress = (id) => {
    setConfirm({
      message: 'Reset all progress for this user?',
      onConfirm: async () => {
        setConfirm(null)
        try { await adminApi.resetUserProgress(id); toast.success('Progress reset.'); load() }
        catch { toast.error('Failed to reset progress.') }
      },
    })
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="adm-tab-content">
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}
      {editUser && <UserEditModal user={editUser} onClose={() => setEditUser(null)} onSaved={() => { setEditUser(null); load() }} />}

      <div className="adm-toolbar">
        <div className="adm-search">
          <Search size={15} />
          <input
            className="adm-search__input"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <span className="adm-count">{total} users</span>
      </div>

      {loading ? <p className="adm-state">Loading...</p> : (
        <div className="adm-card">
          <table className="adm-table">
            <thead>
              <tr>
                <th>User</th><th>Email</th><th>Provider</th>
                <th>Points</th><th>Labs</th><th>Admin</th><th>Joined</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="adm-user-cell">
                      <div className="adm-avatar">{u.name?.charAt(0)?.toUpperCase()}</div>
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td className="adm-muted">{u.email}</td>
                  <td><span className="adm-badge adm-badge--neutral">{u.provider}</span></td>
                  <td>{Number(u.total_points).toLocaleString()}</td>
                  <td>{u.labs_completed}</td>
                  <td>{u.is_admin ? <ShieldCheck size={16} color="#6C63FF" /> : <span className="adm-muted">—</span>}</td>
                  <td className="adm-muted">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="adm-actions">
                      <button className="adm-icon-btn adm-icon-btn--edit" title="Edit" onClick={() => setEditUser(u)}><Pencil size={14} /></button>
                      <button className="adm-icon-btn adm-icon-btn--warn" title="Reset Progress" onClick={() => handleResetProgress(u.id)}><RotateCcw size={14} /></button>
                      <button className="adm-icon-btn adm-icon-btn--danger" title="Delete" onClick={() => handleDelete(u.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="adm-pagination">
          <button className="adm-btn adm-btn--secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <span className="adm-muted">Page {page} / {totalPages}</span>
          <button className="adm-btn adm-btn--secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  )
}

function UserEditModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, is_admin: !!user.is_admin, password: '' })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const payload = { name: form.name, email: form.email, is_admin: form.is_admin }
      if (form.password) payload.password = form.password
      await adminApi.updateUser(user.id, payload)
      toast.success('User updated.')
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="adm-overlay">
      <div className="adm-modal">
        <div className="adm-modal__header">
          <h3>Edit User</h3>
          <button className="adm-icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="adm-modal__body">
          {[
            { label: 'Name',         key: 'name',     type: 'text' },
            { label: 'Email',        key: 'email',    type: 'email' },
            { label: 'New Password', key: 'password', type: 'password', placeholder: 'Leave blank to keep current' },
          ].map(f => (
            <div key={f.key} className="adm-field">
              <label className="adm-label">{f.label}</label>
              <input
                className="adm-input"
                type={f.type}
                placeholder={f.placeholder || ''}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="adm-field adm-field--row">
            <label className="adm-label">Admin</label>
            <input type="checkbox" checked={form.is_admin} onChange={e => setForm(p => ({ ...p, is_admin: e.target.checked }))} />
          </div>
        </div>
        <div className="adm-modal__footer">
          <button className="adm-btn adm-btn--secondary" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}

/* ── Labs Tab ───────────────────────────────────────────── */
function LabsTab() {
  const [labs, setLabs]       = useState([])
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)
  const [editLab, setEditLab] = useState(null)
  const [creating, setCreating] = useState(false)
  const [confirm, setConfirm]   = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    adminApi.getLabs({ search })
      .then(r => setLabs(r.data))
      .catch(() => toast.error('Failed to load labs.'))
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => { load() }, [load])

  const handleDelete = (id) => {
    setConfirm({
      message: 'Delete this lab and all associated progress?',
      onConfirm: async () => {
        setConfirm(null)
        try { await adminApi.deleteLab(id); toast.success('Lab deleted.'); load() }
        catch { toast.error('Failed to delete lab.') }
      },
    })
  }

  return (
    <div className="adm-tab-content">
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}
      {(editLab || creating) && (
        <LabModal
          lab={creating ? null : editLab}
          onClose={() => { setEditLab(null); setCreating(false) }}
          onSaved={() => { setEditLab(null); setCreating(false); load() }}
        />
      )}

      <div className="adm-toolbar">
        <div className="adm-search">
          <Search size={15} />
          <input
            className="adm-search__input"
            placeholder="Search labs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => setCreating(true)}>
          <Plus size={15} /> New Lab
        </button>
      </div>

      {loading ? <p className="adm-state">Loading...</p> : (
        <div className="adm-card">
          <table className="adm-table">
            <thead>
              <tr><th>Title</th><th>Slug</th><th>Category</th><th>Diff</th><th>Points</th><th>Solves</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {labs.map(lab => (
                <tr key={lab.id}>
                  <td>{lab.title}</td>
                  <td className="adm-muted adm-mono">{lab.slug}</td>
                  <td className="adm-muted">{lab.category}</td>
                  <td><span className="adm-badge" style={{ color: DIFF_COLORS[lab.difficulty], background: `${DIFF_COLORS[lab.difficulty]}18` }}>{lab.difficulty}</span></td>
                  <td>{lab.points}</td>
                  <td>{lab.solves}</td>
                  <td>
                    <div className="adm-actions">
                      <button className="adm-icon-btn adm-icon-btn--edit" title="Edit" onClick={() => setEditLab(lab)}><Pencil size={14} /></button>
                      <button className="adm-icon-btn adm-icon-btn--danger" title="Delete" onClick={() => handleDelete(lab.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function LabModal({ lab, onClose, onSaved }) {
  const [form, setForm] = useState({
    title:       lab?.title       || '',
    slug:        lab?.slug        || '',
    category:    lab?.category    || CATEGORIES[0],
    difficulty:  lab?.difficulty  || 'P1',
    points:      lab?.points      || '',
    flag:        lab?.flag        || '',
    description: lab?.description || '',
  })
  const [saving, setSaving] = useState(false)

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const save = async () => {
    setSaving(true)
    try {
      if (lab) await adminApi.updateLab(lab.id, form)
      else     await adminApi.createLab({ ...form, points: Number(form.points) })
      toast.success(lab ? 'Lab updated.' : 'Lab created.')
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save lab.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="adm-overlay">
      <div className="adm-modal adm-modal--wide">
        <div className="adm-modal__header">
          <h3>{lab ? 'Edit Lab' : 'Create Lab'}</h3>
          <button className="adm-icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="adm-modal__body adm-modal__body--grid">
          {[
            { label: 'Title',       key: 'title',       type: 'text' },
            { label: 'Slug',        key: 'slug',        type: 'text' },
            { label: 'Points',      key: 'points',      type: 'number' },
            { label: 'Flag',        key: 'flag',        type: 'text' },
          ].map(f => (
            <div key={f.key} className="adm-field">
              <label className="adm-label">{f.label}</label>
              <input className="adm-input" type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)} />
            </div>
          ))}

          <div className="adm-field">
            <label className="adm-label">Difficulty</label>
            <select className="adm-input" value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="adm-field">
            <label className="adm-label">Category</label>
            <select className="adm-input" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="adm-field adm-field--full">
            <label className="adm-label">Description</label>
            <textarea className="adm-input adm-textarea" rows={4} value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
        </div>
        <div className="adm-modal__footer">
          <button className="adm-btn adm-btn--secondary" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ──────────────────────────────────────────── */
const TABS = [
  { key: 'overview', label: 'Overview',  icon: BarChart3 },
  { key: 'users',    label: 'Users',     icon: Users },
  { key: 'labs',     label: 'Labs',      icon: FlaskConical },
]

export default function AdminPanel() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="adm-page">
      <div className="adm-header">
        <ShieldCheck size={22} className="adm-header__icon" />
        <h1>Admin Panel</h1>
      </div>

      <div className="adm-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`adm-tab${tab === t.key ? ' adm-tab--active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <Overview />}
      {tab === 'users'    && <UsersTab />}
      {tab === 'labs'     && <LabsTab />}
    </div>
  )
}
