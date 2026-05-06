'use client'

import { usePathname } from 'next/navigation';

export default function DashboardTitle() {
  const pathname = usePathname();

  const getTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/dashboard/home':
        return 'Home';
      case '/dashboard/events':
        return 'Events';
      case '/dashboard/scantopay':
        return 'Scan to Pay';
      case '/dashboard/profile':
        return 'Profile';
      case '/dashboard/transfer':
        return 'Transfer Money';
      default:
        return 'Dashboard';
    }
  };

  const title = getTitle(pathname);

  return (
    <h1 className='text-[26px] font-bold text-[#5075FF]'>{title}</h1>
  );
}