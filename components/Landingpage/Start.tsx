"use client";

import { useRef, useState } from "react";

const carouselImages = [
  {
    src: "/s1.png",
    alt: "Business woman using payment app on laptop",
  },
  {
    src: "/s2.png",
    alt: "Woman smiling at phone with app UI",
  },
  {
    src: "/s3.png",
    alt: "Man using mobile banking",
  },
  {
    src: "/s1.png",
    alt: "Business woman using payment app on laptop",
  },
  {
    src: "/s2.png",
    alt: "Woman smiling at phone with app UI",
  },
  {
    src: "/s3.png",
    alt: "Man using mobile banking",
  },
];

const CARD_W = 400; // visible card width in px
const GAP = 16;     // gap between cards in px
const STEP = CARD_W + GAP;

export default function StartTodaySection() {
  const [offset, setOffset] = useState(0);
  const maxOffset = (carouselImages.length - 3) * STEP; // show ~3 at a time

  const prev = () => setOffset((o) => Math.max(0, o - STEP));
  const next = () => setOffset((o) => Math.min(maxOffset, o + STEP));

  return (
    <section className="w-full bg-[#f9f9f9] py-32 my-5 px-6 sm:px-12 lg:px-20 overflow-hidden">

      {/* ── Top row: heading + subtitle + arrows ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">

        {/* Left: heading */}
        <h2 className="text-3xl sm:text-xl font-bold text-gray-900 leading-snug max-w-xs">
          Start today to create the business target you have always aimed for.
        </h2>

        {/* Right: subtitle + arrows stacked */}
        <div className="flex flex-col items-start sm:items-end gap-6 sm:pt-2">
          <p className="text-gray-500 text-sm sm:text-base max-w-[220px] sm:text-right leading-relaxed">
            You hit your target when you manage your business well
          </p>

          {/* Prev / Next arrows */}
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              disabled={offset === 0}
              aria-label="Previous"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              disabled={offset >= maxOffset}
              aria-label="Next"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Carousel track ── */}
      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {carouselImages.map((img, idx) => (
            <div
              key={idx}
              className="relative flex-shrink-0 rounded-2xl overflow-hidden shadow-md"
              style={{ width: CARD_W, height: 220 }}
            >
              {/* Left dark accent bar on first card (matches design) */}
              {idx === 0 && (
                <div className="absolute left-0 top-0 h-full w-2 bg-gray-800 z-10 rounded-l-2xl" />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}