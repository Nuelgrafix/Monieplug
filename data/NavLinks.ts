import { Home, Users, Settings, CreditCard } from 'lucide-react'

export const AdminNavLinks = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Home',
    href: '/dashboard/home',
    icon: Home,
  },
  {
    name: 'Events',
    href: '/dashboard/events',
    icon: Users,
  },
  {
    name: 'Scan to Pay',
    href: '/dashboard/scantopay',
    icon: CreditCard,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: Settings,
  },
]