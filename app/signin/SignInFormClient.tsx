"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { loginStart, loginSuccess, loginFailure } from "@/redux/slices/authSlice";
import { useLoginMutation } from "@/redux/slices/apiSlice";
import * as yup from "yup";
import toast from "react-hot-toast";

const BG_IMAGE   = "/subg.png";
const SIDE_IMAGE = "/su1.png";
const LOGO_SRC   = "/logo.jpg";

const COUNTRIES = [
  { code: "NG", dial: "+234" },
  { code: "US", dial: "+1"   },
  { code: "GB", dial: "+44"  },
  { code: "GH", dial: "+233" },
  { code: "KE", dial: "+254" },
];

const schema = yup.object().shape({
  phone    : yup.string().required("Phone number is required"),
  password : yup.string().required("Password is required"),
});

export default function SignInForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const dispatch     = useDispatch<AppDispatch>();
  const [login]      = useLoginMutation();

  const { loading } = useSelector((state: RootState) => state.auth);

  const [country,      setCountry]      = useState(COUNTRIES[0]);
  const [phone,        setPhone]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isReady = phone.trim() !== "" && password.trim() !== "";

  const handleSubmit = async () => {
    if (!isReady) return;

    try {
      await schema.validate({ phone, password });

      dispatch(loginStart());

      const result = await login({ phone, password }).unwrap();

      dispatch(loginSuccess({ user: result.user, token: result.token }));

      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Sign in failed";
      dispatch(loginFailure(msg));
      toast.error(msg);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${BG_IMAGE}')` }}
    >
      {/* Dark blurred overlay */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 backdrop-blur-sm bg-black/55">

        {/* Outer rounded dark frame */}
        <div className="w-full max-w-[740px] bg-white/10 backdrop-blur-md rounded-[22px] p-4 shadow-2xl">

          {/* Inner white card */}
          <div className="bg-white rounded-2xl overflow-hidden flex">

            {/* Left: image panel */}
            <div className="relative hidden sm:flex flex-col justify-end w-[260px] flex-shrink-0 min-h-[400px]">
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

              {/* Phone */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-4 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="flex-1 px-3 py-3 text-sm focus:outline-none text-gray-700 placeholder-gray-400 min-w-0"
                />
              </div>

              {/* Password */}
              <div className="relative mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Forgot / Hide row */}
              <div className="flex justify-between items-center mb-5">
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => router.push('/forgot-password')}
                >
                  Forget password?
                </button>
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? "Hide password" : "Show password"}
                </button>
              </div>

              {/* Sign in button */}
              <button
                type="button"
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

              {/* Forgot Password */}
              <p className="text-center text-xs text-gray-500 mt-2">
                <Link href="/forgot-password" className="text-[#2338e0] font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </p>

              {/* Sign up link */}
              <p className="text-center text-xs text-gray-500 mt-2">
                New to Monieplug?{" "}
                <Link href="/signup" className="text-[#2338e0] font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>

            </div>
            {/* end right panel */}
          </div>
          {/* end inner white card */}
        </div>
        {/* end outer frame */}
      </div>
      {/* end overlay */}

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
