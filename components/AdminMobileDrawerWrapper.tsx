"use client";

import React from "react";
import DashboardTitle from "@/components/DashboardTitle";

export default function AdminMobileDrawerWrapper() {
  return (
    <header className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="w-10" />
      <DashboardTitle />
      <div className="w-10" />
    </header>
  );
}