import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../services/api'

export default function AuthCallback() {
  const [params]  = useSearchParams()
  const { login } = useAuth()
  const navigate  = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    if (!token) { navigate('/login'); return }
    localStorage.setItem('token', token)
    authApi.me()
      .then(r => { login(token, r.data); navigate('/') })
      .catch(() => navigate('/login'))
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: 'var(--clr-text-muted)', fontFamily: 'var(--font-secondary)' }}>Signing you in...</p>
    </div>
  )
}
