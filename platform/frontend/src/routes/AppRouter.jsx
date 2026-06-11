import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Dashboard from '../pages/Dashboard/Dashboard'
import Labs from '../pages/Labs'
// import Leaderboard from '../pages/Leaderboard'
// import Profile from '../pages/Profile'
// import Settings from '../pages/Settings'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/labs" element={<Labs />} />
          {/* <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
