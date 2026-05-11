"use client";

import Image from "next/image";
import { useState, useRef } from "react";

// ─── Swap this for your actual video file in /public ───
const VIDEO_SRC = null;
// ─── Swap this for your video thumbnail in /public ───
const POSTER_SRC = "/poster.png";

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <section className="w-full py-20 px-4 flex flex-col items-center">
      {/* ── Heading ── */}
      <div className="text-center max-w-xl mb-10">
        <h2 className="text-3xl sm:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
          See what you can do easily
          <br />
          with Monieplug
        </h2>
        <p className="mt-5 text-gray-500 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
          With monieplug you can set your business finance standard, easily
          create and see events, set up an account to recieve your money easily
          with our Scan2Pay features.
        </p>
      </div>

      {/* ── Video container ── */}
      <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden cursor-pointer group">
        <video
          ref={videoRef}
          src={""}
          poster={POSTER_SRC}
          className="w-full h-auto block"
          onEnded={() => setPlaying(false)}
          onClick={handleVideoClick}
          playsInline
        />

        {/* Play button overlay — hidden while playing */}
        {!playing && (
          <button
            onClick={handlePlay}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Dark scrim on hover */}
            <span className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-200" />

            {/* Play icon circle */}
            <span className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gray-900/90 shadow-xl group-hover:scale-110 transition-transform duration-200">
              {/* Triangle */}
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="w-7 h-7 ml-1"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <div>
        <Image src={'/Section.png'} width={1278} height={1235} alt="sec"/>
      </div>
    </section>
  );
}