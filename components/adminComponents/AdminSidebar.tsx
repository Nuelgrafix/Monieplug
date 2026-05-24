"use client";
import { LogOut, Home, Calendar, QrCode, User } from "lucide-react";
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from "next/image";

interface NavLink {
  name: string
  href: string
  icon?: React.ComponentType
}

interface AdminSidebarProps {
  AdminNavLinks: NavLink[]
  handleLogout: () => void
}

export default function AdminSidebar({ AdminNavLinks, handleLogout }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full text-white">
  <Sidebar handleLogout={handleLogout} />
    </div>
  )
}




const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Events", href: "/dashboard/events", icon: Calendar },
  { label: "Scan2Pay", href: "/dashboard/scantopay", icon: QrCode },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export function Sidebar({ handleLogout }: { handleLogout: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-[300px] min-h-screen bg-[#1E35C8] px-4 py-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <Image src={'/logo.jpg'} width={106} height={32} alt="lgo"/>
      </div>

      {/* Create Event CTA */}
      <Link
        href="/events/create"
        className="mb-6 bg-[#FF6B00] hover:bg-[#e05f00] active:scale-95 transition-all duration-150 text-white text-sm font-semibold rounded-lg py-2.5 px-4 text-center shadow-md"
      >
        Create event
      </Link>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-white text-[#1E35C8] shadow-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Log Out */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-150 mt-auto"
      >
        <LogOut size={16} strokeWidth={2} />
        Log Out
      </button>
    </aside>
  );
}