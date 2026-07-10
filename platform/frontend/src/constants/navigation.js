

import { LayoutDashboard, Target, Trophy, ScrollText, Bot, User, Settings, Radar, ShieldCheck } from 'lucide-react'

export const NAV_ITEMS = [
  { label: 'Dashboard',    icon: LayoutDashboard, path: '/' },
  { label: 'Labs',         icon: Target,          path: '/labs' },
  { label: 'Leaderboard',  icon: Trophy,          path: '/leaderboard' },
  { label: 'Paths',        icon: ScrollText,      path: '/paths' },
  { label: 'Certificates', icon: ScrollText,      path: '/certificates' },
  { label: 'AI Mentor',    icon: Bot,             path: '/ai-mentor' },
  { label: 'Profile',      icon: User,            path: '/profile' },
  { label: 'Recon',        icon: Radar,           path: '/recon' },
  { label: 'Settings',     icon: Settings,        path: '/settings' },
]

export const ADMIN_NAV_ITEM = { label: 'Admin', icon: ShieldCheck, path: '/admin' }
