import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import Navbar from '../components/Navbar/Navbar'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="layout">
      {/* Overlay for mobile drawer */}
      {drawerOpen && (
        <div
          className="layout-overlay"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile, fixed on desktop */}
      <div className={`layout-sidebar${drawerOpen ? ' open' : ''}`}>
        <Sidebar onClose={() => setDrawerOpen(false)} />
      </div>

      {/* Right side: Navbar + Content */}
      <div className="layout-body">
        <Navbar onMenuToggle={() => setDrawerOpen((v) => !v)} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
