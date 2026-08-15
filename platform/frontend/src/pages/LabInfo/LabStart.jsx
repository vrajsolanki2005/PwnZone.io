import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { progressApi } from '../../services/api'

export default function LabStart() {
  const { slug }    = useParams()
  const navigate    = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    progressApi.startSession(slug)
      .then(r => {
        const { lab_url, session_id } = r.data
        const base = lab_url.startsWith('http') ? lab_url : window.location.origin + lab_url
        const url = new URL(base)
        if (session_id) url.searchParams.set('session', session_id)
        const token = localStorage.getItem('token')
        if (token) url.searchParams.set('token', token)
        url.searchParams.set('returnUrl', `${window.location.origin}/labs/${slug}`)
        window.location.href = url.toString()
      })
      .catch(() => setError(true))
  }, [slug])

  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
      <p style={{ color: 'var(--clr-text-secondary)' }}>Lab not found or unavailable.</p>
      <button onClick={() => navigate(`/labs/${slug}`)} style={{ color: 'var(--clr-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
        ← Back to lab details
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
      <p style={{ color: 'var(--clr-text-secondary)', fontSize: 14 }}>Launching lab environment…</p>
    </div>
  )
}
