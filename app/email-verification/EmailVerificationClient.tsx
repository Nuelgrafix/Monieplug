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
    <div className="w-full flex justify-center gap-2 sm:gap-3 mb-4">
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
          className="w-[44px] h-[48px] sm:w-[50px] sm:h-[50px] text-center text-[18px] sm:text-[24px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5075FF] transition-all"
        />
      ))}
    </div>
  );
}

const EmailVerification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    return searchParams.get("email") || localStorage.getItem("signup_email") || "";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (email) localStorage.setItem("signup_email", email);
  }, [email]);

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
    <main className="bg-[#5075FF] min-h-screen flex items-center justify-center p-4 sm:p-6">
      {/* Mobile Layout */}
      <div className="sm:hidden w-full max-w-[360px] bg-white rounded-2xl overflow-hidden shadow-xl p-6 flex flex-col items-center gap-5">
        {/* Header */}
        <div className="w-full text-center">
          <Image
            src="/logo.jpg"
            alt="monieplug logo"
            width={120}
            height={36}
            className="h-8 w-auto mx-auto mb-4"
          />
          <h2 className="text-[#333333] text-[18px] font-bold leading-tight">
            Enter code sent to your email address
          </h2>
          {email && (
            <p className="text-xs text-gray-500 mt-1 truncate">{email}</p>
          )}
        </div>

        <OtpInputs value={otp} onChange={setOtp} />

        <button
          onClick={handleVerify}
          disabled={verifying || code.length !== 6}
          className="w-full bg-[#1843E2] hover:bg-[#4060E8] transition-colors h-[48px] rounded-[8px] text-white text-[15px] font-semibold disabled:opacity-60 flex items-center justify-center"
        >
          {verifying ? "Verifying..." : "Verify"}
        </button>

        <button
          onClick={handleResend}
          disabled={verifying}
          className="text-sm text-[#1843E2] hover:underline"
        >
          Didn&apos;t receive a code? Resend
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex w-full max-w-[950px] min-h-[500px] bg-[#5075FF] rounded-[32px] border-2 border-[#F9F9F933] p-6">
        <div className="bg-white min-h-[440px] flex flex-col lg:flex-row gap-[40px] justify-center items-center w-full rounded-[24px] overflow-hidden">
          {/* Profile Image Section */}
          <div className="w-full max-w-[422px] h-[220px] lg:h-[540px] relative flex-shrink-0">
            <Image
              src="/generated-image-1.png"
              alt="Login Image"
              width={422}
              height={540}
              className="w-full h-full object-cover rounded-[24px] lg:rounded-[40px]"
            />
            <Image
              src="/logo.jpg"
              alt="monieplug logo"
              width={1000}
              height={1000}
              className="absolute bottom-[10px] lg:bottom-[20px] left-0 h-[32px] lg:h-[43px] w-[100px] lg:w-[142.7px] rounded-tr-[10px] lg:rounded-tr-[16px]"
            />
          </div>

          {/* Form Section */}
          <div className="w-full max-w-[422px] p-4 lg:p-5 flex flex-col justify-center items-center gap-4 lg:px-8">
            <h2 className="text-[#333333] text-[24px] lg:text-[32px] font-bold mb-2 text-center leading-tight">
              Enter code sent to your email address
            </h2>
            {email && (
              <p className="text-sm text-gray-500 -mt-3 mb-2">{email}</p>
            )}

            <OtpInputs value={otp} onChange={setOtp} />

            <button
              onClick={handleVerify}
              disabled={verifying || code.length !== 6}
              className="w-full bg-[#1843E2] flex justify-center items-center gap-2 hover:bg-[#4060E8] transition-colors h-[52px] lg:h-[60px] rounded-[8px] text-white text-[16px] font-semibold disabled:opacity-60"
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
    </main>
  );
};

export default EmailVerification;
