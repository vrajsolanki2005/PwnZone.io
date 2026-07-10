import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, Menu, User, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import NotificationPopover from '../Notifications/NotificationPopover'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar/Avatar'
import './Navbar.css'

export default function Navbar({ onMenuToggle }) {
  const { theme, toggle } = useTheme()
  const { user, logout }  = useAuth()
  const navigate          = useNavigate()
  const [open, setOpen]   = useState(false)
  const ref               = useRef(null)
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'

  // close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/login')
  }

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

        {/* Avatar + dropdown */}
        <div className="navbar-profile" ref={ref}>
          <button className="navbar-avatar-btn" onClick={() => setOpen(v => !v)} aria-label="Profile menu">
            <Avatar className="navbar-avatar">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </button>

          {open && (
            <div className="navbar-dropdown">
              <div className="navbar-dropdown__user">
                <p className="navbar-dropdown__name">{user?.name || 'User'}</p>
                <p className="navbar-dropdown__email">{user?.email || ''}</p>
              </div>
              <div className="navbar-dropdown__divider" />
              <button className="navbar-dropdown__item" onClick={() => { setOpen(false); navigate('/profile') }}>
                <User size={14} /> Profile
              </button>
              <button className="navbar-dropdown__item navbar-dropdown__item--danger" onClick={handleLogout}>
                <LogOut size={14} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
