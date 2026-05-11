"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingHeader() {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-1.5 group">
          <Image src={'/logo.jpg'} width={98} height={28} alt="logo"/>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-left gap-8">
          {[
            { label: "Events", href: "/events" },
            { label: "Scan2Pay", href: "/scan2pay" },
            { label: "About Us", href: "/about" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              {label}
            </Link>
          ))}
        </nav>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/signin")}
          className="bg-[#1E35C8] hover:bg-[#1a2eb0] active:scale-[0.97] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
        >
          Sign in
        </button>
      </div>
    </header>
  );
}