import './Tag.css'

export default function Tag({ label, color = 'purple', onRemove }) {
  return (
    <span className={`tag tag--${color}`}>
      {label}
      {onRemove && (
        <button className="tag-remove" onClick={onRemove} aria-label="Remove">×</button>
      )}
    </span>
  )
}
