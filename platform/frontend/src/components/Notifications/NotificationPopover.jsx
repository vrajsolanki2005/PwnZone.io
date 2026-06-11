import { useState } from 'react'
import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './NotificationPopover.css'

const dummyNotifications = [
  {
    id: '1',
    title: 'New Message',
    description: 'You have received a new message from John Doe',
    timestamp: new Date(),
    read: false,
  },
  {
    id: '2',
    title: 'System Update',
    description: 'System maintenance scheduled for tomorrow',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: '3',
    title: 'Reminder',
    description: 'Meeting with team at 2 PM',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
]

function NotificationItem({ notification, index, onMarkAsRead }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="notif-item"
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="notif-item-header">
        <div className="notif-item-title-row">
          {!notification.read && <span className="notif-dot" />}
          <span className="notif-title">{notification.title}</span>
        </div>
        <span className="notif-timestamp">
          {notification.timestamp.toLocaleDateString()}
        </span>
      </div>
      <p className="notif-description">{notification.description}</p>
    </motion.div>
  )
}

export default function NotificationPopover({
  notifications: initialNotifications = dummyNotifications,
  onNotificationsChange,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updated)
    onNotificationsChange?.(updated)
  }

  const markAsRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    setNotifications(updated)
    onNotificationsChange?.(updated)
  }

  return (
    <div className="notif-wrapper">
      <button
        className="navbar-icon-btn notif-bell-btn"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Toggle notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="notif-popover"
          >
            <div className="notif-popover-header">
              <span className="notif-popover-title">Notifications</span>
              <button className="notif-mark-all-btn" onClick={markAllAsRead}>
                Mark all as read
              </button>
            </div>

            <div className="notif-list">
              {notifications.map((n, i) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  index={i}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
