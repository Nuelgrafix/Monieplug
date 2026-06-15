"use client";

import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useSetPinMutation } from "@/redux/slices/apiSlice";
import toast from "react-hot-toast";

const BG_IMAGE = "/subg.png";

function PinInput({
  value,
  onChange,
  show,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  show: boolean;
}) {
  const refs = Array.from({ length: 4 }, () => useRef<HTMLInputElement>(null));

  const handleChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const ch = e.target.value.replace(/\D/, "").slice(-1);
    const next = [...value];
    next[i] = ch;
    onChange(next);
    if (ch && i < 3) refs[i + 1].current?.focus();
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
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
          className="w-10 h-10 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E35C8]"
        />
      ))}
    </div>
  );
}

export default function SetPinPage() {
  const router = useRouter();
  const [setPinMutation, { isLoading }] = useSetPinMutation();

  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const pinString = pin.join("");
  const confirmPinString = confirmPin.join("");
  const isReady = pinString.length === 4 && confirmPinString.length === 4 && pinString === confirmPinString;

  const handleSubmit = async () => {
    if (!isReady || isLoading) return;

    try {
      await setPinMutation({ pin: pinString }).unwrap();
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
        <div className="w-full max-w-[400px] bg-white rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
              Set Your PIN
            </h1>
            <p className="text-gray-600 text-sm">
              Create a 4-digit PIN to secure your transfers
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">New PIN</label>
            <div className="relative">
              <PinInput value={pin} onChange={setPin} show={showPin} />
              <button
                type="button"
                onClick={() => setShowPin((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Confirm PIN</label>
            <div className="relative">
              <PinInput value={confirmPin} onChange={setConfirmPin} show={showConfirmPin} />
              <button
                type="button"
                onClick={() => setShowConfirmPin((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showConfirmPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {pinString !== confirmPinString && confirmPinString.length > 0 && (
              <p className="text-xs text-red-500 mt-2">PINs do not match</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isReady || isLoading}
            className={`w-full py-3 rounded-lg text-white text-sm font-semibold transition-all duration-200 ${
              isReady && !isLoading
                ? "bg-[#1E35C8] hover:bg-[#1a2eb0] active:scale-[0.98]"
                : "bg-[#1E35C8]/40 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Setting PIN..." : "Set PIN"}
          </button>
        </div>
      </div>
    </div>
  );
}