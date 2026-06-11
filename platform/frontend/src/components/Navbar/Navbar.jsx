import { Sun, Moon, Menu, User } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import NotificationPopover from '../Notifications/NotificationPopover'
import './Navbar.css'

export default function Navbar({ onMenuToggle }) {
  const { theme, toggle } = useTheme()

  return (
    <header className="navbar">
      <button className="navbar-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
        <Menu size={22} />
      </button>
      <div className="navbar-right">
        <NotificationPopover />
        <button className="navbar-icon-btn" onClick={toggle} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <User size={22} className="navbar-avatar" />
      </div>
    </header>
  )
}
