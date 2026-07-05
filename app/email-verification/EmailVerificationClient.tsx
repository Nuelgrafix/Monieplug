"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyEmailMutation } from "@/redux/slices/apiSlice";
import toast from "react-hot-toast";

interface OtpInputsProps {
  value: string[];
  onChange: (v: string[]) => void;
}

function OtpInputs({ value, onChange }: OtpInputsProps) {
  const refs = Array.from({ length: 6 }, () => React.useRef<HTMLInputElement>(null));

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const ch = e.target.value.replace(/\D/, "").slice(-1);
    const next = [...value];
    next[i] = ch;
    onChange(next);
    if (ch && i < 5) refs[i + 1].current?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  return (
    <div className="w-full flex justify-center gap-2 sm:gap-4 mb-4">
      {value.map((v, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          placeholder="0"
          className="w-[38px] h-[44px] sm:w-[50px] sm:h-[50px] text-center text-[20px] sm:text-[24px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5075FF] transition-all"
        />
      ))}
    </div>
  );
}

const EmailVerification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Prefer URL query param, fall back to localStorage (set after signup)
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    return searchParams.get("email") || localStorage.getItem("signup_email") || "";
  });

  // Keep localStorage in sync if URL changes after mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (email) localStorage.setItem("signup_email", email);
  }, [email]);

  // Re-read from URL / localStorage whenever the searchParams changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const qpEmail = searchParams.get("email");
    if (qpEmail) {
      setEmail(qpEmail);
    } else {
      setEmail(localStorage.getItem("signup_email") || "");
    }
  }, [searchParams]);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [verifyEmail, { isLoading: verifying }] = useVerifyEmailMutation();

  const code = otp.join("");

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    try {
      await verifyEmail({ code }).unwrap();
      toast.success("Email verified successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid or expired verification code");
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found. Please go back to signup.");
      return;
    }
    try {
      await verifyEmail({ email }).unwrap();
      toast.success("New code sent to your email");
      setOtp(Array(6).fill(""));
    } catch {
      toast.error("Failed to resend code");
    }
  };

  return (
    <main className='bg-[#5075FF] lg:bg-white min-h-screen flex items-center justify-center p-2 sm:p-4'>
      {/* Desktop Layout */}
      <div className='hidden sm:block w-full max-w-[950px] min-h-[500px] bg-[#5075FF] rounded-[24px] sm:rounded-[32px] border-2 border-[#F9F9F933] p-2 sm:p-6'>
        <div className='bg-white min-h-[440px] flex flex-col lg:flex-row gap-[40px] justify-center items-center w-full rounded-[16px] sm:rounded-[24px] overflow-hidden'>
          {/* Profile Image Section */}
          <div className='w-full max-w-[422px] h-[220px] sm:h-[540px] relative ml-0 lg:ml-[20px] flex-shrink-0'>
            <Image 
              src="/generated-image-1.png" 
              alt="Login Image" 
              width={422} 
              height={540}
              className='w-full sm:w-[422px] h-[220px] sm:h-[540px] py-2 sm:py-5 rounded-[24px] sm:rounded-[40px] object-cover'
            />
            <Image 
              src="/logo.jpg" 
              alt='monieplug logo' 
              width={1000} 
              height={1000}
              className='absolute bottom-[10px] lg:bottom-[20px] left-0 h-[32px] sm:h-[43px] w-[100px] sm:w-[142.7px] rounded-tr-[10px] sm:rounded-tr-[16px]'
            />
          </div>
          <div className='w-full max-w-[422px] sm:p-5 h-auto sm:h-[457px] mx-auto flex flex-col justify-center items-center gap-4 sm:px-8'>
            <h2 className='text-[#333333] text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold mb-2 text-center'>
              Enter code sent to your email address
            </h2>
            {email && <p className="text-sm text-gray-500 -mt-3 mb-2">{email}</p>}

            <OtpInputs value={otp} onChange={setOtp} />

            <button
              onClick={handleVerify}
              disabled={verifying || code.length !== 6}
              className='w-full bg-[#1843E2] flex justify-center items-center gap-2 hover:bg-[#4060E8] transition-colors text-[18px] border-solid border-2 border-[#1843E2] max-h-[50px] sm:h-[60px] rounded-[8px] text-white py-2 text-sm font-semibold disabled:opacity-60'
            >
              {verifying ? "Verifying..." : "Verify"}
            </button>

            <button
              onClick={handleResend}
              disabled={verifying}
              className="text-sm text-[#1843E2] hover:underline mt-1"
            >
              Didn&apos;t receive a code? Resend
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='block lg:hidden w-[306px] h-[697px] bg-[#A9BCFF] rounded-[24px] p-4 mx-auto'>
        <div className='w-full h-full bg-white rounded-[24px] flex flex-col items-center gap-6'>
          {/* Profile Image Section */}
          <div className='w-full max-w-[422px] p-4 h-[220px] sm:h-[540px] relative ml-0 lg:ml-[20px] flex-shrink-0'>
            <Image 
              src="/generated-image-1.png" 
              alt="Login Image" 
              width={1000} 
              height={1000}
              className='w-full sm:w-[422px] h-[220px] sm:h-[540px] py-2 sm:py-5 rounded-[24px] sm:rounded-[40px] object-cover'
            />
            <Image 
              src="/logo.jpg" 
              alt='monieplug logo' 
              width={1000} 
              height={1000}
              className='absolute bottom-[10px] left-0 h-[32px] sm:h-[43px] w-[100px] sm:w-[142.7px] rounded-tr-[10px] sm:rounded-tr-[16px]'
            />
          </div>

          <div className='w-full px-2'>
            <h2 className='text-[#333333] text-[20px] xs:text-[22px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold mb-2 text-center'>
              Enter code sent to your email address
            </h2>
            {email && <p className="text-xs text-gray-500 text-center -mt-2 mb-3">{email}</p>}

            <OtpInputs value={otp} onChange={setOtp} />

            <button
              onClick={handleVerify}
              disabled={verifying || code.length !== 6}
              className='w-full bg-[#1843E2] hover:bg-[#4060E8] transition-colors h-[48px] rounded-[8px] text-white text-[16px] font-semibold mt-6 disabled:opacity-60'
            >
              {verifying ? "Verifying..." : "Verify"}
            </button>

            <button
              onClick={handleResend}
              disabled={verifying}
              className="text-sm text-[#1843E2] hover:underline mt-3 block mx-auto"
            >
              Didn&apos;t receive a code? Resend
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmailVerification;
