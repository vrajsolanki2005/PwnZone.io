import './Badge.css'

export default function NotificationBadge({ count, children }) {
  return (
    <div className="badge-wrap">
      {children}
      {count > 0 && (
        <span className="badge-dot">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </div>
  )
}
