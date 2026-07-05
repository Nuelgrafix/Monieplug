"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation, useVerifyEmailMutation } from "@/redux/slices/apiSlice";
import * as yup from "yup";
import toast from "react-hot-toast";

// ── Swap these paths ──
const BG_IMAGE   = "/subg.png";   // blurred background photo
const SIDE_IMAGE = "/su1.png";  // man on phone (left panel)
const LOGO_SRC   = "/logo.jpg";        // Monieplug logo

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword] = useForgotPasswordMutation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isReady = email.trim() !== "";

  const handleSubmit = async () => {
    if (!isReady) return;

    try {
      const schema = yup.object().shape({
        email: yup.string().email('Invalid email address').required('Email is required'),
      });
      await schema.validate({ email });

      setLoading(true);

      await forgotPassword(email).unwrap();

      toast.success('Reset code sent to your email');
      router.push('/reset-password');
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.data?.message || 'Failed to send reset code');
    }
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
            <div className="hidden sm:flex w-[200px] flex-shrink-0 bg-gray-100 rounded-l-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SIDE_IMAGE} alt="" className="w-full h-full object-cover rounded-l-2xl" />
            </div>

            {/* Right: content */}
            <div className="flex-1 p-7 flex flex-col gap-4">

              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-[2rem] font-bold text-gray-900 leading-tight mb-2">
                  Forgot Password
                </h1>
                <p className="text-gray-600 text-sm">
                  Enter your email address to receive a reset code
                </p>
              </div>

              {/* Email */}
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              />

              {/* Submit button */}
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
                    Sending…
                  </span>
                ) : (
                  "Send Reset Code"
                )}
              </button>

              {/* Back to sign in */}
              <p className="text-center text-xs text-gray-500 mt-4">
                Remember your password?{" "}
                <a
                  href="/signin"
                  className="text-[#2338e0] font-semibold hover:underline"
                >
                  Sign in
                </a>
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