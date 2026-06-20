"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle2, ShieldCheck } from "lucide-react";
import { useSetPinMutation } from "@/redux/slices/apiSlice";
import toast from "react-hot-toast";

const BG_IMAGE = "/subg.png";

function SegmentedPinInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => inputRef.current?.focus()}
      >
        {[0, 1, 2, 3].map((i) => {
          const filled = i < value.length;
          const isCurrent = i === value.length;
          return (
            <div
              key={i}
              className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 ease-out ${
                error && filled
                  ? "border-red-400 bg-red-50"
                  : filled
                    ? "border-[#1E35C8] bg-[#1E35C8]/5 shadow-[0_2px_16px_rgba(30,53,200,0.15)]"
                    : isCurrent
                      ? "border-[#1E35C8]/50 bg-white"
                      : "border-gray-200 bg-white"
              }`}
            >
              {filled ? (
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ease-out ${
                    error ? "bg-red-500" : "bg-[#1E35C8]"
                  }`}
                  style={{ animation: "pinPop 0.25s ease-out" }}
                />
              ) : isCurrent ? (
                <div className="w-0.5 h-5 bg-[#1E35C8] rounded-full animate-pulse" />
              ) : null}
            </div>
          );
        })}
      </div>
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        maxLength={4}
        value={value}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, "").slice(0, 4);
          onChange(val);
        }}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        autoFocus
      />
    </div>
  );
}

export default function SetPinPage() {
  const router = useRouter();
  const [setPinMutation, { isLoading }] = useSetPinMutation();

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState<"create" | "confirm">("create");

  const isReady = pin.length === 4 && confirmPin.length === 4 && pin === confirmPin;

  const handleSubmit = async () => {
    if (!isReady || isLoading) return;

    try {
      await setPinMutation({ pin }).unwrap();
      toast.success("PIN set successfully!");
      router.push("/dashboard/home");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to set PIN");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${BG_IMAGE}')` }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 backdrop-blur-sm bg-black/55">
        <div className="w-full max-w-[400px] bg-white rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#1E35C8]/10 flex items-center justify-center mb-5">
              <ShieldCheck size={28} className="text-[#1E35C8]" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight mb-1.5">
              {step === "create" ? "Create your PIN" : "Confirm your PIN"}
            </h1>
            <p className="text-gray-400 text-sm text-center max-w-[280px]">
              {step === "create"
                ? "Set a 4-digit PIN to secure your wallet"
                : "Re-enter your PIN to confirm"}
            </p>
          </div>

          {step === "create" ? (
            <div className="flex flex-col items-center">
              <SegmentedPinInput value={pin} onChange={setPin} />
              <div className="flex items-center gap-2 mt-6">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < pin.length ? "bg-[#1E35C8]" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => pin.length === 4 && setStep("confirm")}
                disabled={pin.length < 4}
                className={`w-full mt-8 py-3.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 ${
                  pin.length === 4
                    ? "bg-[#1E35C8] hover:bg-[#1a2eb0] active:scale-[0.98]"
                    : "bg-[#1E35C8]/30 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <SegmentedPinInput
                value={confirmPin}
                onChange={setConfirmPin}
                error={confirmPin.length > 0 && confirmPin !== pin}
              />

              {confirmPin.length > 0 && confirmPin !== pin && (
                <p className="text-xs text-red-500 mt-4 flex items-center gap-1">
                  <X size={12} /> PINs do not match
                </p>
              )}
              {pin.length === 4 && confirmPin === pin && (
                <p className="text-xs text-green-600 mt-4 flex items-center gap-1">
                  <CheckCircle2 size={12} /> PINs match
                </p>
              )}

              <div className="flex gap-3 w-full mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setStep("create");
                    setConfirmPin("");
                  }}
                  className="flex-1 py-3.5 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isReady || isLoading}
                  className={`flex-1 py-3.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 ${
                    isReady && !isLoading
                      ? "bg-[#1E35C8] hover:bg-[#1a2eb0] active:scale-[0.98]"
                      : "bg-[#1E35C8]/30 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Setting…
                    </span>
                  ) : (
                    "Set PIN"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
