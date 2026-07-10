import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, ADMIN_NAV_ITEM } from '../../constants/navigation'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

export default function Sidebar({ onClose }) {
  const { user } = useAuth()
  const items = user?.is_admin ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🛡</span>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title">Bug Bounty</span>
          <span className="sidebar-logo-sub">Simulator Lab</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `sidebar-nav-item${isActive ? ' active' : ''}`
            }
            onClick={onClose}
          >
            <item.icon className="sidebar-nav-icon" size={18} />
            <span className="sidebar-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
