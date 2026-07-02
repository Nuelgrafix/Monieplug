// The RootLayout component
"use client";
import { AdminNavLinks } from "@/data/NavLinks";
import AdminSidebar, { Sidebar } from "@/components/adminComponents/AdminSidebar";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { logout as logoutAction } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/signin");
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {open && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
        )}
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-[#1E35C8] to-[#1a2eb0] transform transition-transform duration-300 ease-out z-50 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar handleLogout={handleLogout} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed h-screen w-[300px] border-r border-[#eee]">
        <AdminSidebar
          AdminNavLinks={AdminNavLinks}
          handleLogout={handleLogout}
        />
      </div>

      <div className="lg:ml-[300px] min-h-screen bg-[#F5F5F5]">{children}</div>

      {/* Mobile Menu Button */}
      <button
        ref={btnRef}
        onClick={() => setOpen(true)}
        className={`lg:hidden fixed bottom-6 right-6 z-30 bg-[#1E35C8] text-white p-4 rounded-full shadow-lg transition-all duration-200 ${
          open ? "scale-0" : "scale-100"
        }`}
        aria-label="Open menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </>
  );
}
