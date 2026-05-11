"use client";

import Image from "next/image";

// ── Swap these paths for your actual assets in /public ──
const SUPPORT_IMAGE = "/support-woman.png";
const AVATAR_IMAGE  = "/support-avatar.png";

export default function GetSupportSection() {
  return (
    <>
      <style>{`
        @keyframes waveDrift {
          0%   { transform: scale(1.05) translate(0px, 0px); }
          33%  { transform: scale(1.08) translate(-12px, 8px); }
          66%  { transform: scale(1.06) translate(10px, -6px); }
          100% { transform: scale(1.05) translate(0px, 0px); }
        }
        .wave-bg {
          animation: waveDrift 14s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      <section className="w-full px-4 sm:px-8 lg:px-16 py-10">
        {/* Outer card */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-[#1a2de0] min-h-[340px] flex items-center" style={{ backgroundImage: `url('/hero.svg')`, backgroundPosition: 'right top', backgroundSize: '100% auto', backgroundRepeat: 'no-repeat' }}>

          {/* Dark-left vignette so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2de0]/80 via-[#1a2de0]/40 to-transparent pointer-events-none" />

          {/* ── Content row ── */}
          <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-10 px-8 sm:px-12 py-12">

            {/* Left: text */}
            <div className="flex-1 max-w-md">
              <h2 className="text-white font-bold text-3xl sm:text-4xl leading-snug mb-5">
                Get support<br />whenever you need it.
              </h2>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
                Our global team spread across the country has proudly supported
                over 350,000 customers. Whatever you need, we'll be there to
                help you take controll over your business with our standard tool
                of finance organization.
              </p>

              {/* Avatar + contact links */}
              <div className="flex flex-col gap-3">
                {/* Avatar row */}
                <div className="flex items-center gap-3">
                  <a
                    href="mailto:support@monieplug.com"
                    className="text-blue-200 text-sm underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Contact Email Support
                  </a>
                </div>

                {/* WhatsApp */}
                <p className="text-blue-200 text-sm">
                  Call/WhatsApp:{" "}
                  <a
                    href="tel:+2347026002246"
                    className="text-blue-200 underline underline-offset-2 hover:text-white transition-colors"
                  >
                    +2347026002246
                  </a>
                </p>
              </div>
            </div>
            <div>
            <Image src={'/sup.png'} width={457} height={360} alt="img"/>
        </div>
          </div>
          
        </div>
        
      </section>
    </>
  );
}