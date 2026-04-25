"use client"

import { AdminNavLinks } from '@/data/NavLinks'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'

interface AdminMobileDrawerProps {
  isOpen: boolean
  handleLogout: () => void
  onClose: () => void
  btnRef: React.RefObject<HTMLButtonElement>
}

export default function AdminMobileDrawer({ isOpen, handleLogout, onClose, btnRef }: AdminMobileDrawerProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Monieplug Admin</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {AdminNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center p-2 rounded hover:bg-gray-100 ${
                    pathname === link.href ? 'bg-blue-100 text-blue-600' : ''
                  }`}
                >
                  {link.icon && <link.icon className="mr-2" size={20} />}
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  )
}