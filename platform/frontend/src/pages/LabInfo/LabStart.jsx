import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { labApi } from '../../services/api'

export default function LabStart() {
  const { slug }    = useParams()
  const navigate    = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    labApi.getOne(slug)
      .then(r => {
        const labUrl = r.data.lab_url
        const token = localStorage.getItem('token')
        const base = labUrl.startsWith('http') ? labUrl : window.location.origin + labUrl
        const url = new URL(base)
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
