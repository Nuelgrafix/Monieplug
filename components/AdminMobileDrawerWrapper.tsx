"use client";

import React, { useState } from "react";
import { BiMenu } from "react-icons/bi";
import DashboardTitle from "@/components/DashboardTitle";
import AdminMobileDrawer from "@/components/Header/AdminMobileDrawer";

function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="lg:hidden w-full flex items-center justify-between mb-4">
      <button
        onClick={onMenuClick}
        className="text-[#1E35C8] p-2"
        aria-label="Open menu"
      >
        <BiMenu size="28" />
      </button>
      <DashboardTitle />
      <div className="w-9" />
    </header>
  );
}

export default function AdminMobileDrawerWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden">
        <MobileHeader onMenuClick={() => setOpen(true)} />
      </div>
      <AdminMobileDrawer
        isOpen={open}
        handleLogout={() => {}}
        onClose={() => setOpen(false)}
      />
    </>
  );
}