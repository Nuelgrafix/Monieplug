"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface QRLoadingScreenProps {
  onComplete?: () => void;
  redirectTo?: string;
  duration?: number; // ms
}

export default function QRLoadingScreen({
  onComplete,
  redirectTo = "/scan2pay/qr",
  duration = 3000,
}: QRLoadingScreenProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        router.push(redirectTo);
      }
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-white flex flex-col items-center justify-center gap-8 p-6">
      {/* Spinning logo */}
      <div className="relative w-20 h-20">
        {/* Spinner arc */}
        <svg
          className="absolute inset-0 animate-spin"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="#E5E7EB"
            strokeWidth="4"
          />
          <path
            d="M40 4 A36 36 0 0 1 76 40"
            stroke="#1E35C8"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        {/* M logo centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="28"
            height="22"
            viewBox="0 0 28 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 22V0L9.5 13.5L14 6L18.5 13.5L28 0V22L23 22V10L18.5 17L14 10L9.5 17V22H0Z"
              fill="#1E35C8"
            />
          </svg>
        </div>
      </div>

      {/* Text */}
      <p className="text-center text-gray-700 text-base leading-relaxed">
        Please hang on while we generate
        <br />
        your <span className="font-semibold text-gray-900">QR code</span>
      </p>
    </div>
  );
}