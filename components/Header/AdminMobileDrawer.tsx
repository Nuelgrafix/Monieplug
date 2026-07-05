"use client"

import { AdminNavLinks } from '@/data/NavLinks'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, LogOut } from 'lucide-react'
import { useEffect } from 'react'

interface AdminMobileDrawerProps {
  isOpen: boolean
  handleLogout: () => void
  onClose: () => void
}

export default function AdminMobileDrawer({ isOpen, handleLogout, onClose }: AdminMobileDrawerProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-[#1E35C8] to-[#1a2eb0] shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-out">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Monieplug</h2>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {AdminNavLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-white text-[#1E35C8] font-semibold shadow-lg' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {link.icon && <link.icon size={20} strokeWidth={2} />}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <LogOut size={20} strokeWidth={2} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}