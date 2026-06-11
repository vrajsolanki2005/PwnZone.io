import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Dashboard from '../pages/Dashboard/Dashboard'
import Labs from '../pages/Labs'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/labs" element={<Labs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
