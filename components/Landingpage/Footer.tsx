// ── Swap for your actual logo in /public ──
const LOGO_SRC = "/logo.jpg";

export default function FooterCTA() {
  return (

    <div>
      <hr className="text-[#A9BCFF]"/>
      <footer className="w-full bg-gradient-to-b from-white to-gray-100">

      {/* ── CTA block ── */}
      <div className="flex flex-col items-center text-center px-6 pt-16 pb-12 gap-5">

        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_SRC}
          width={172}
          height={52}
          alt="Monieplug"
          className=""
        />

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 max-w-md leading-snug">
          Let's get started on something great
        </h2>

        {/* Subtext */}
        <p className="text-gray-500 text-sm sm:text-base max-w-sm">
          Sign up today, and get unlimited freedom to run your business.
        </p>

        {/* CTA button */}
        <a
          href="/signup"
          className="mt-1 inline-block bg-[#2338e0] hover:bg-[#1a2bbf] active:scale-95 text-white font-semibold text-sm px-10 py-3 rounded-lg transition-all duration-200"
        >
          Sign up
        </a>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-gray-200 px-6 sm:px-12 lg:px-20 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
        <span>© monieplug, all right reserved</span>
        <nav className="flex items-center gap-5">
          <a href="/terms"   className="hover:text-gray-700 transition-colors">Terms</a>
          <a href="/privacy" className="hover:text-gray-700 transition-colors">Privacy</a>
          <a href="/cookies" className="hover:text-gray-700 transition-colors">Cookies</a>
        </nav>
      </div>
    </footer>
    </div>
  );
}