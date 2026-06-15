import { Sun, Moon, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import NotificationPopover from '../Notifications/NotificationPopover'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar/Avatar'
import './Navbar.css'

export default function Navbar({ onMenuToggle }) {
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

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
        <button className="navbar-avatar-btn" onClick={() => navigate('/profile')} aria-label="Profile">
          <Avatar className="navbar-avatar">
            <AvatarImage src="https://api.dicebear.com/9.x/adventurer/svg?seed=jayshah" alt="Jay Shah" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  )
}
