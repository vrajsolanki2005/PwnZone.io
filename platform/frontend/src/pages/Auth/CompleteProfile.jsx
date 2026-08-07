import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './Auth.css'

export default function CompleteProfile() {
  const [phone, setPhone]   = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { user, login }     = useAuth()
  const navigate            = useNavigate()

  const validatePhone = (v) => /^\+?[1-9]\d{6,14}$/.test(v.replace(/[\s\-]/g, ''))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!phone)                  return setError('Phone number is required.')
    if (!validatePhone(phone))   return setError('Enter a valid phone number (e.g. +1234567890).')
    setLoading(true)
    try {
      await api.patch('/users/phone', { phone: phone.replace(/[\s\-]/g, '') })
      login(localStorage.getItem('token'), { ...user, phone })
      toast.success('Profile completed!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save phone number.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="auth-logo">📱</div>
        <h1 className="auth-title">One last step</h1>
        <p className="auth-sub">Enter your phone number to complete signup</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Phone Number</label>
            <div className={`auth-input-wrap${error ? ' auth-input-error' : ''}`}>
              <Phone size={16} className="auth-input-icon" />
              <input
                type="tel"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError('') }}
              />
            </div>
            {error && <span className="auth-error">{error}</span>}
          </div>

          <button className="auth-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Complete Signup'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
