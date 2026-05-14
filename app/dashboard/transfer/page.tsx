"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";
import React from 'react'

const page = () => {
  return (
    <div>
      <SendMoneyFlow/>
    </div>
  )
}

export default page


// ─── Constants ───────────────────────────────────────────────────────────────

const NIGERIAN_BANKS = [
  "Access Bank", "Citibank Nigeria", "Ecobank Nigeria", "Fidelity Bank",
  "First Bank of Nigeria", "First City Monument Bank (FCMB)", "Guaranty Trust Bank (GTBank)",
  "Heritage Bank", "Keystone Bank", "Polaris Bank", "Providus Bank",
  "Stanbic IBTC Bank", "Standard Chartered Bank", "Sterling Bank", "SunTrust Bank",
  "Union Bank of Nigeria", "United Bank for Africa (UBA)", "Unity Bank",
  "Wema Bank", "Zenith Bank", "Kuda Bank", "Opay", "Palmpay", "Moniepoint MFB",
];

const QUICK_AMOUNTS = [1000, 5000, 10000, 100000];

type Step = "account" | "amount" | "success";
type Modal = null | "confirm" | "password";

// ─── Shared modal backdrop ────────────────────────────────────────────────────

function Backdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

 function SendMoneyFlow() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<Step>("account");
  const [modal, setModal] = useState<Modal>(null);

  // Account details
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [accountName] = useState("Emmanue Ebuka"); // normally resolved via API
  const [bankOpen, setBankOpen] = useState(false);

  // Amount
  const [amount, setAmount] = useState("");

  // Password
  const [password, setPassword] = useState("");

  // ── Derived
  const isAcctComplete = accountNumber.length === 10;
  const isBankComplete = selectedBank !== "";
  const accountCanProceed = isAcctComplete && isBankComplete;
  const amountCanProceed = Number(amount) > 0;
  const formatted = amount ? `₦${Number(amount).toLocaleString()}` : "₦0";

  // ── Handlers
  const handleAccountNext = () => {
    if (accountCanProceed) setStep("amount");
  };

  const handleSend = () => {
    if (amountCanProceed) setModal("confirm");
  };

  const handleConfirm = () => {
    setModal("password");
  };

  const handlePasswordSend = () => {
    if (password.length >= 4) {
      setModal(null);
      setStep("success");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SUCCESS SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className=" flex items-center justify-left p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center text-center">
          {/* Success icon */}
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle2 size={36} className="text-green-500" strokeWidth={1.8} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Transfer successful</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            You have successfully sent{" "}
            <span className="font-semibold text-gray-800">{formatted}</span> to{" "}
            <span className="font-semibold text-gray-800">{accountName}</span>
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-8 w-full py-3 rounded-xl bg-[#1E35C8] text-white text-sm font-semibold hover:bg-[#1a2eb0] active:scale-[0.98] transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACCOUNT DETAILS SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (step === "account") {
    return (
      <div className="] flex items-center justify-left p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => router.back()} className="text-gray-700 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Enter account details</h1>
          </div>

          {/* Step 1 – Account Number */}
          <div className="bg-[#F9F9F9] rounded-xl p-4 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} className={isAcctComplete ? "text-[#1E35C8]" : "text-gray-300"} strokeWidth={2} />
              <span className="text-sm font-semibold text-gray-800">1. Account Number</span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="Account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 focus:border-[#1E35C8] transition-all bg-white"
            />
          </div>

          {/* Step 2 – Select Bank */}
          <div className="bg-[#F9F9F9] rounded-xl p-4 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} className={isBankComplete ? "text-[#1E35C8]" : "text-gray-300"} strokeWidth={2} />
              <span className="text-sm font-semibold text-gray-800">2. Select Bank</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setBankOpen((p) => !p)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 focus:border-[#1E35C8] transition-all"
              >
                <span className={selectedBank ? "text-gray-800" : "text-gray-400"}>{selectedBank || "Bank name"}</span>
                <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 ${bankOpen ? "rotate-180" : ""}`} />
              </button>
              {bankOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                  {NIGERIAN_BANKS.map((bank) => (
                    <li
                      key={bank}
                      onClick={() => { setSelectedBank(bank); setBankOpen(false); }}
                      className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${selectedBank === bank ? "bg-[#1E35C8]/10 text-[#1E35C8] font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      {bank}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Step 3 – Account Name (auto-resolved) */}
          {isAcctComplete && isBankComplete && (
            <div className="bg-[#F9F9F9] rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={18} className="text-[#1E35C8]" strokeWidth={2} />
                <span className="text-sm font-semibold text-gray-800">3. Account Name</span>
              </div>
              <input
                readOnly
                value={accountName}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white cursor-default focus:outline-none"
              />
            </div>
          )}

          {/* Next */}
          <button
            onClick={handleAccountNext}
            disabled={!accountCanProceed}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${accountCanProceed ? "bg-[#1E35C8] text-white hover:bg-[#1a2eb0] active:scale-[0.98] shadow-sm" : "bg-[#1E35C8]/40 text-white/70 cursor-not-allowed"}`}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ENTER AMOUNT SCREEN  +  MODALS
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className={`w-full max-w-md bg-white rounded-2xl shadow-sm p-6 transition-all ${modal ? "opacity-40 pointer-events-none select-none" : ""}`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep("account")} className="text-gray-700 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Enter amount</h1>
        </div>

        {/* Amount input */}
        <div className="bg-[#F9F9F9] rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={18} className={amountCanProceed ? "text-[#1E35C8]" : "text-gray-300"} strokeWidth={2} />
            <span className="text-sm font-semibold text-gray-800">Enter amount</span>
          </div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="₦0000"
            value={amount ? `₦${Number(amount).toLocaleString()}` : ""}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, "");
              setAmount(raw);
            }}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 focus:border-[#1E35C8] transition-all bg-white mb-3"
          />

          {/* Quick amounts */}
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(String(amt))}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${Number(amount) === amt ? "bg-[#1E35C8] text-white border-[#1E35C8]" : "border-gray-300 text-gray-600 hover:border-[#1E35C8] hover:text-[#1E35C8]"}`}
              >
                ₦{amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!amountCanProceed}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${amountCanProceed ? "bg-[#1E35C8] text-white hover:bg-[#1a2eb0] active:scale-[0.98] shadow-sm" : "bg-[#1E35C8]/40 text-white/70 cursor-not-allowed"}`}
        >
          Send
        </button>
      </div>

      {/* ── CONFIRM MODAL */}
      {modal === "confirm" && (
        <Backdrop>
          <div className="bg-white rounded-2xl shadow-xl w-[320px] p-6 text-center">
            <p className="text-sm text-gray-500 mb-1">You are about to transfer money to</p>
            <p className="text-base font-bold text-gray-900 mb-4">{accountName}</p>
            <p className="text-3xl font-bold text-[#1E35C8] mb-4">{formatted}</p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-xs border border-gray-300 rounded-full px-3 py-1 text-gray-600">{accountNumber}</span>
              <span className="text-xs border border-gray-300 rounded-full px-3 py-1 text-gray-600">{selectedBank}</span>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full py-3 rounded-xl border-2 border-[#1E35C8] text-[#1E35C8] text-sm font-semibold hover:bg-[#1E35C8]/5 active:scale-[0.98] transition-all"
            >
              Confirm
            </button>
          </div>
        </Backdrop>
      )}

      {/* ── PASSWORD MODAL */}
      {modal === "password" && (
        <Backdrop>
          <div className="bg-white rounded-2xl shadow-xl w-[320px] p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Enter transfer password</h2>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="0000"
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, ""))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 focus:border-[#1E35C8] transition-all mb-4 text-center tracking-widest text-lg"
            />
            <button
              onClick={handlePasswordSend}
              disabled={password.length < 4}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${password.length >= 4 ? "bg-[#1E35C8] text-white hover:bg-[#1a2eb0] active:scale-[0.98]" : "border-2 border-[#1E35C8]/40 text-[#1E35C8]/40 cursor-not-allowed"}`}
            >
              Send
            </button>
          </div>
        </Backdrop>
      )}
    </div>
  );
}