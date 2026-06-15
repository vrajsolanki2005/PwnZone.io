import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'

import Login        from '../pages/Auth/Login'
import Signup       from '../pages/Auth/Signup'
import AuthCallback from '../pages/Auth/AuthCallback'

import Dashboard   from '../pages/Dashboard/Dashboard'
import Labs        from '../pages/Labs/Labs'
import Leaderboard from '../pages/Leaderboard/Leaderboard'
import Paths       from '../pages/Paths/Paths'
import Certificates from '../pages/Certificates/Certificates'
import AiMentor    from '../pages/AiMentor/AiMentor'
import Profile     from '../pages/Profile/Profile'
import Settings    from '../pages/Settings/Settings'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login"          element={<Login />} />
        <Route path="/signup"         element={<Signup />} />
        <Route path="/auth/callback"  element={<AuthCallback />} />

        {/* Protected dashboard routes */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/"              element={<Dashboard />} />
          <Route path="/labs"          element={<Labs />} />
          <Route path="/leaderboard"   element={<Leaderboard />} />
          <Route path="/paths"          element={<Paths />} />
          <Route path="/certificates"  element={<Certificates />} />
          <Route path="/ai-mentor"     element={<AiMentor />} />
          <Route path="/profile"       element={<Profile />} />
          <Route path="/settings"      element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
