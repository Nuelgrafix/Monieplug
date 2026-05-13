"use client";

import { useRef, useState, KeyboardEvent, ChangeEvent } from "react";
import Link from "next/link";

// ── Swap these paths ──
const BG_IMAGE   = "/subg.png";   // blurred background photo
const SIDE_IMAGE = "/su1.png";  // man on phone (left panel)
const LOGO_SRC   = "/logo.jpg";        // Monieplug logo

const COUNTRIES = [
  { code: "NG", dial: "+234" },
  { code: "US", dial: "+1" },
  { code: "GB", dial: "+44" },
  { code: "GH", dial: "+233" },
  { code: "KE", dial: "+254" },
];

export default function SignInPage() {
  const [country, setCountry]   = useState(COUNTRIES[0]);
  const [pin, setPin]           = useState(["", "", "", "", "", ""]);
  const [showPin, setShowPin]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const handlePinChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const ch = e.target.value.replace(/\D/, "").slice(-1);
    const next = [...pin];
    next[i] = ch;
    setPin(next);
    if (ch && i < 5) refs[i + 1].current?.focus();
  };

  const handlePinKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  const isReady = pin.every((d) => d !== "");

  const handleSubmit = () => {
    if (!isReady) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1500); // simulate API call
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${BG_IMAGE}')` }}
    >
      {/* Dark blurred overlay */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 backdrop-blur-sm bg-black/55">

        {/* ── Outer rounded frame (the dark card visible in screenshot) ── */}
        <div className="w-full max-w-[740px] bg-white/10 backdrop-blur-md rounded-[22px] p-4 shadow-2xl">

          {/* ── Inner white card ── */}
          <div className="bg-white rounded-2xl overflow-hidden flex">

            {/* Left: image panel */}
            <div className="relative hidden sm:flex flex-col justify-end w-[260px] flex-shrink-0 min-h-[370px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SIDE_IMAGE}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </div>

            {/* Right: form panel */}
            <div className="flex-1 flex flex-col justify-center px-8 py-10">
              {/* Heading */}
              <p className="text-gray-500 text-sm mb-0.5 tracking-wide">
                Welcome &nbsp;back to Monieplug
              </p>
              <h1 className="text-[2rem] font-bold text-gray-900 leading-tight mb-6">
                Sign in
              </h1>

              {/* Phone / country selector */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-4 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <div className="relative flex items-center">
                  <select
                    value={country.code}
                    onChange={(e) =>
                      setCountry(
                        COUNTRIES.find((c) => c.code === e.target.value) ||
                          COUNTRIES[0]
                      )
                    }
                    className="appearance-none bg-transparent pl-3 pr-6 py-3 text-sm text-gray-700 focus:outline-none cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} {c.dial}
                      </option>
                    ))}
                  </select>
                  {/* Chevron */}
                  <svg
                    viewBox="0 0 16 16"
                    className="absolute right-1 w-3 h-3 text-gray-400 pointer-events-none fill-none stroke-current"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
                  </svg>
                </div>
                {/* Divider */}
                <div className="w-px h-5 bg-gray-200" />
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="flex-1 px-3 py-3 text-sm focus:outline-none text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* PIN boxes */}
              <div className="flex gap-2 mb-1">
                {pin.map((val, i) => (
                  <input
                    key={i}
                    ref={refs[i]}
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handlePinChange(i, e)}
                    onKeyDown={(e) => handlePinKey(i, e)}
                    className="w-full aspect-square max-w-[52px] text-center text-base font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                ))}
              </div>

              {/* Forgot / Hide row */}
              <div className="flex justify-between items-center mb-5">
                <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  Forget password?
                </button>
                <button
                  onClick={() => setShowPin((s) => !s)}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPin ? "Hide password" : "Hide password"}
                </button>
              </div>

              {/* Sign in button */}
              <button
                onClick={handleSubmit}
                disabled={!isReady || loading}
                className={`w-full py-3 rounded-lg text-white text-sm font-semibold transition-all duration-200
                  ${isReady && !loading
                    ? "bg-[#2338e0] hover:bg-[#1a2bbf] active:scale-[0.98]"
                    : "bg-[#2338e0]/40 cursor-not-allowed"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>

              {/* Sign up prompt */}
              <p className="text-center text-xs text-gray-500 mt-4">
                New to Monieplug?{" "}
                <Link
                  href="/signup"
                  className="text-[#2338e0] font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 flex items-center justify-between text-xs text-white/60 bg-black/30">
        <span>© monieplug, all right reserved</span>
        <nav className="flex gap-5">
          <a href="/terms"   className="hover:text-white transition-colors">Terms</a>
          <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
          <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
        </nav>
      </footer>
    </div>
  );
}