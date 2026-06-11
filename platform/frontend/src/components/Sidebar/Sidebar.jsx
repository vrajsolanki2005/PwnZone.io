import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../../constants/navigation'
import './Sidebar.css'

export default function Sidebar({ onClose }) {
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
        {NAV_ITEMS.map((item) => (
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
