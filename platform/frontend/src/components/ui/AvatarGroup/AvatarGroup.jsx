import './AvatarGroup.css'

export default function AvatarGroup({ avatars = [], max = 4, size = 36 }) {
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - max

  return (
    <div className="avatar-group" style={{ '--av-size': `${size}px` }}>
      {visible.map((av, i) => (
        <div key={i} className="avatar-group-item" title={av.name}>
          {av.src
            ? <img src={av.src} alt={av.name} />
            : <span>{av.name?.[0]}</span>
          }
        </div>
      ))}
      {overflow > 0 && (
        <div className="avatar-group-item avatar-group-overflow">
          +{overflow}
        </div>
      )}
    </div>
  )
}
