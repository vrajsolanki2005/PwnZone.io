

import { LayoutDashboard, Target, Trophy, ScrollText, Bot, User, Settings } from 'lucide-react'

export const NAV_ITEMS = [
  { label: 'Dashboard',    icon: LayoutDashboard, path: '/' },
  { label: 'Labs',         icon: Target,          path: '/labs' },
  { label: 'Leaderboard',  icon: Trophy,          path: '/leaderboard' },
  { label: 'Certificates', icon: ScrollText,      path: '/certificates' },
  { label: 'AI Mentor',    icon: Bot,             path: '/ai-mentor' },
  { label: 'Profile',      icon: User,            path: '/profile' },
  { label: 'Settings',     icon: Settings,        path: '/settings' },
]
