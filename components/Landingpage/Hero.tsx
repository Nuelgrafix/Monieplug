"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const slideImages = [
  {
    src: "./s1.png",
    alt: "Business woman using payment app",
  },
  {
    src: "./s2.png",
    alt: "Woman smiling at phone",
  },
  {
    src: "./s3.png",
    alt: "Man using mobile banking",
  },
];

export default function HeroPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animFrameRef = useRef<number>(0);
  const offsetRef = useRef(0);

  // Animated wave background on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawWaves = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep blue base
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#0a1a6e");
      bg.addColorStop(0.5, "#1130b8");
      bg.addColorStop(1, "#0a1a6e");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Draw sweeping wave lines
      const numLines = 28;
      for (let i = 0; i < numLines; i++) {
        const t = i / numLines;
        const alpha = 0.06 + t * 0.08;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(100, 149, 255, ${alpha})`;
        ctx.lineWidth = 1.2;

        const startX = width * 0.55 + i * 14;
        const startY = -height * 0.1;

        ctx.moveTo(startX, startY);

        const cp1x = width * 0.7 + Math.sin(frame * 0.008 + i * 0.25) * 60;
        const cp1y = height * 0.35;
        const cp2x = width * 0.2 + Math.cos(frame * 0.006 + i * 0.2) * 80;
        const cp2y = height * 0.7;
        const endX = -width * 0.05 + i * 5;
        const endY = height * 1.05;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.stroke();
      }

      // Subtle glow orb top-right
      const glow = ctx.createRadialGradient(
        width * 0.75,
        height * 0.2,
        0,
        width * 0.75,
        height * 0.2,
        width * 0.4
      );
      glow.addColorStop(0, "rgba(80, 120, 255, 0.18)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      frame++;
      animFrameRef.current = requestAnimationFrame(drawWaves);
    };

    drawWaves();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Continuous auto-scroll slider
  useEffect(() => {
    const CARD_WIDTH = 320; // px including gap
    const TOTAL = slideImages.length;
    let rafId: number;

    const step = () => {
      if (!isPaused) {
        offsetRef.current += 0.6; // px per frame — adjust speed here
        if (offsetRef.current >= CARD_WIDTH * TOTAL) {
          offsetRef.current = 0;
        }
        if (sliderRef.current) {
          sliderRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isPaused]);

  // Duplicate slides for seamless loop
  const allSlides = [...slideImages, ...slideImages];

  return (
    <main className="min-h-screen bg-[#0a1a6e] flex flex-col" >
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden min-h-[60vh]" style={{ backgroundImage: `url('/hero.svg')`, backgroundPosition: 'right top', backgroundSize: '100% auto', backgroundRepeat: 'no-repeat' }}>
        {/* Animated canvas background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: "block" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto">
          <h1 className="text-white font-bold text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight drop-shadow-lg">
            Manage your business in one end.
          </h1>
          <p className="text-blue-200 text-base sm:text-lg max-w-md leading-relaxed">
            Easily share an event, get payment for your services or business and
            manage your funds super easy.
          </p>
          <button
            className="mt-2 bg-white text-[#1130b8] font-semibold text-sm sm:text-base px-8 py-3 rounded-full shadow-lg hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-200"
            onClick={() => router.push('/signup')}
          >
            Create an account
          </button>
        </div>
      </section>

      {/* ── Sliding images strip ── */}
      <section
        className="relative w-full overflow-hidden bg-[#0a1a6e] pb-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-[#0a1a6e] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-[#0a1a6e] to-transparent" />

        {/* Track — will be translated by JS */}
        <div
          className="flex gap-4 will-change-transform"
          style={{ width: "max-content" }}
          ref={sliderRef}
        >
          {allSlides.map((img, idx) => (
            <div
              key={idx}
              className="relative flex-shrink-0 w-82 h-52 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}