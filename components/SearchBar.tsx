"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/dashboard/events?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search event"
        className="pl-10 pr-4 py-[10px] text-[#667085] px-[14px] w-full max-w-[493px] h-[44px]
         border border-[#D0D5DD] rounded-[8px] bg-white focus:outline-none focus:border-[#1843E2]"
      />
    </form>
  );
}
