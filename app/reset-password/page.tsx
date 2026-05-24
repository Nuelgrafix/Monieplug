"use client";

import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useResetPasswordMutation } from "@/redux/slices/apiSlice";
import * as yup from "yup";
import toast from "react-hot-toast";

// ── Swap these paths ──
const BG_IMAGE   = "/subg.png";   // blurred background photo
const SIDE_IMAGE = "/su1.png";  // man on phone (left panel)
const LOGO_SRC   = "/logo.jpg";        // Monieplug logo

/* ─────────────────────────────────────────
   OTP / PIN input (6 boxes)
 ───────────────────────────────────────── */
function PinInput({
  value,
  onChange,
  show,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  show: boolean;
}) {
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const handleChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const ch = e.target.value.replace(/\D/, "").slice(-1);
    const next = [...value];
    next[i] = ch;
    onChange(next);
    if (ch && i < 5) refs[i + 1].current?.focus();
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {value.map((v, i) => (
        <input
          key={i}
          ref={refs[i]}
          type={show ? "text" : "password"}
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          className="w-11 h-11 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isReady = code.every((d) => d !== "") && password.trim() !== "" && confirmPassword.trim() !== "";

  const handleSubmit = async () => {
    if (!isReady) return;

    const codeString = code.join('');

    try {
      const schema = yup.object().shape({
        code: yup.string().matches(/^\d{6}$/, 'Code must be 6 digits').required('Code is required'),
        password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
        confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords do not match').required('Confirm password is required'),
      });
      await schema.validate({ code: codeString, password, confirmPassword });

      setLoading(true);

      await resetPassword({ code: codeString, password }).unwrap();

      toast.success('Password reset successfully');
      router.push('/signin');
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.data?.message || 'Failed to reset password');
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
                  Reset Password
                </h1>
                <p className="text-gray-600 text-sm">
                  Enter the code sent to your email and your new password
                </p>
              </div>

              {/* Code input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reset Code</label>
                <PinInput value={code} onChange={setCode} show={true} />
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

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
                    Resetting…
                  </span>
                ) : (
                  "Reset Password"
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