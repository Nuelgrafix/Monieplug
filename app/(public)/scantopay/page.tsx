"use client";

import { useEffect, useState } from "react";

import React from 'react'

function page() {
  return (
    <div>
      <PaymentFlow />
    </div>
  )
}

export default page

// ── Config ──
const BANK_NAME   = "FidelityMoniePlug";
const ACCT_NUMBER = "9038340539";
const ACCT_NAME   = "Emmanuel N.";
const USER_EMAIL  = "email@gmail.com";
const COUNTDOWN_S = 20 * 60;

const VARIATIONS  = ["Chelsea Match", "Man U Match", "R Madrid Match"];

type Method = "card" | "transfer" | null;
type Screen = "form" | "method" | "transfer" | "card" | "success";

function fmt(n: number) {
  return "₦" + n.toLocaleString();
}

/* ══════════════════════════════════
   Shared: Stepper
══════════════════════════════════ */
function Stepper({ active }: { active: "info" | "checkout" }) {
  return (
    <div className="flex items-center gap-1 text-xs mb-8">
      <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-orange-400" />
      <span className={active === "info" ? "text-gray-700 font-medium" : "text-gray-400"}>
        Payment information
      </span>
      <div className="flex-1 border-t border-dashed border-gray-300 mx-2" />
      <span className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${active === "checkout" ? "bg-orange-400" : "bg-gray-300"}`} />
      <span className={active === "checkout" ? "text-gray-700 font-medium" : "text-gray-400"}>
        Checkout
      </span>
      <svg viewBox="0 0 16 16" className="w-3 h-3 ml-0.5 text-gray-300 fill-none stroke-current">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3l5 5-5 5" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════
   Shared: Order Summary card
══════════════════════════════════ */
function OrderSummary({
  title = "Order Summary",
  fee,
  charges,
  showCharges = false,
  btnLabel,
  btnActive,
  onBtn,
  extra,
}: {
  title?: string;
  fee: number;
  charges: number;
  showCharges?: boolean;
  btnLabel: string;
  btnActive: boolean;
  onBtn: () => void;
  extra?: React.ReactNode;
}) {
  const total = fee + charges;

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
        {extra && <div className="mb-4">{extra}</div>}
        <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
        <hr className="border-gray-200 mb-4" />

        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Payment fee</span>
          <span>{fmt(fee)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span>Charges</span>
          <span>{showCharges ? fmt(charges) : "——"}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-gray-900 mb-5">
          <span>{showCharges ? "Total" : "Subtotal"}</span>
          <span>{fmt(showCharges ? total : fee)}</span>
        </div>

        <button
          onClick={onBtn}
          disabled={!btnActive}
          className={`w-full font-semibold text-sm py-2.5 rounded-lg transition-all duration-200 text-white
            ${btnActive
              ? "bg-[#2338e0] hover:bg-[#1a2bbf] active:scale-95 cursor-pointer"
              : "bg-[#2338e0]/30 cursor-not-allowed"
            }`}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   SCREEN 1: Payment details form
══════════════════════════════════ */
function ScreenForm({ onNext }: { onNext: (fee: number) => void }) {
  const [fullName, setFullName]             = useState("");
  const [email, setEmail]                   = useState("");
  const [confirmEmail, setConfirmEmail]     = useState("");
  const [amount, setAmount]                 = useState("");
  const [selectedVariation, setVariation]   = useState<string | null>(null);

  const amountNum  = parseFloat(amount) || 0;
  const charges    = selectedVariation ? Math.round(amountNum * 0.02) : 0;
  const subtotal   = amountNum + charges;

  const isReady = !!(
    fullName.trim() &&
    email.trim() &&
    confirmEmail.trim() &&
    email === confirmEmail &&
    amountNum > 0 &&
    selectedVariation
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-4xl">
      {/* Left: form */}
      <div className="flex-1">
        <h2 className="text-sm font-bold text-gray-900 mb-4">
          Fill out the payment details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-blue-400">
            <span className="text-xs text-gray-400 whitespace-nowrap">Amount to be paid</span>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 text-sm text-right focus:outline-none min-w-0"
            />
          </div>
          <input
            type="email"
            placeholder="Confirm email address"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            className={`border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              confirmEmail && email !== confirmEmail
                ? "border-red-400"
                : "border-gray-300"
            }`}
          />
        </div>

        {confirmEmail && email !== confirmEmail && (
          <p className="text-xs text-red-500 mb-2">Emails do not match</p>
        )}

        <p className="text-xs text-orange-500 mb-4">
          Note: your receipt will be sent to the email provided above, please provide a valid email.
        </p>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">Select payment variation</p>
          <div className="flex flex-wrap gap-2">
            {VARIATIONS.map((v) => (
              <button
                key={v}
                onClick={() => setVariation(v)}
                className={`text-xs px-4 py-1.5 rounded-full border transition-all duration-150 ${
                  selectedVariation === v
                    ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: summary */}
      <OrderSummary
        fee={amountNum}
        charges={charges}
        btnLabel="Continue"
        btnActive={isReady}
        onBtn={() => onNext(amountNum)}
      />
    </div>
  );
}

/* ══════════════════════════════════
   SCREEN 2: Choose payment method
══════════════════════════════════ */
function ScreenMethod({
  fee,
  method,
  setMethod,
  onContinue,
}: {
  fee: number;
  method: Method;
  setMethod: (m: Method) => void;
  onContinue: () => void;
}) {
  const charges = 50;

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-4xl">
      <div className="flex-1">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Payment method</h2>
        <div className="flex gap-3 flex-wrap">
          {(["card", "transfer"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`flex items-center gap-2 border rounded-lg px-4 py-2.5 text-sm transition-all ${
                method === m
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              {m === "card" ? (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={1.8}>
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              )}
              {m === "card" ? "Pay with Bank card" : "Transfer"}
              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                method === m ? "border-blue-500 bg-blue-500" : "border-gray-300"
              }`} />
            </button>
          ))}
        </div>
      </div>

      <OrderSummary
        fee={fee}
        charges={charges}
        btnLabel="Continue"
        btnActive={!!method}
        onBtn={onContinue}
      />
    </div>
  );
}

/* ══════════════════════════════════
   SCREEN 3a: Bank Transfer
══════════════════════════════════ */
function ScreenTransfer({ fee, onPaid }: { fee: number; onPaid: () => void }) {
  const [copied, setCopied] = useState(false);
  const [secs, setSecs]     = useState(COUNTDOWN_S);
  const charges             = 50;

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  const copy = () => {
    navigator.clipboard.writeText(ACCT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-4xl">
      <div className="flex-1">
        <h2 className="text-sm font-bold text-gray-900 mb-1">Paying through Bank Transfer</h2>
        <p className="text-sm text-gray-500 mb-4">Make payment through bank transfer to</p>

        <div className="border border-gray-200 rounded-xl px-6 py-5 inline-block min-w-[220px]">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl font-bold text-[#2338e0] tracking-wide">{ACCT_NUMBER}</span>
            <button onClick={copy} className="text-gray-400 hover:text-gray-700 transition-colors">
              {copied ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-green-500 fill-none" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth={1.8}>
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#2338e0] font-medium">{BANK_NAME}</span>
            <span className="text-gray-500">{ACCT_NAME}</span>
          </div>
        </div>
      </div>

      <OrderSummary
        fee={fee}
        charges={charges}
        showCharges
        btnLabel="I have paid"
        btnActive={true}
        onBtn={onPaid}
        extra={
          <p className="text-base font-bold">
            Pay within <span className="text-orange-400">{mm}:{ss}</span>
          </p>
        }
      />
    </div>
  );
}

/* ══════════════════════════════════
   SCREEN 3b: Bank Card
══════════════════════════════════ */
function ScreenCard({ fee, onCheckout }: { fee: number; onCheckout: () => void }) {
  const [bank, setBank]     = useState("");
  const [card, setCard]     = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv]       = useState("");
  const [pin, setPin]       = useState("");
  const charges             = 50;

  const isReady = !!(bank.trim() && card.trim() && expiry.trim() && cvv.trim() && pin.trim());

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-4xl">
      <div className="flex-1">
        <h2 className="text-sm font-bold text-gray-900 mb-1">Paying through Bank Card</h2>
        <p className="text-sm text-gray-500 mb-4">Add your bank card to make payment</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input placeholder="Bank name" value={bank} onChange={(e) => setBank(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input placeholder="Card number" value={card} onChange={(e) => setCard(e.target.value)} inputMode="numeric" maxLength={19}
            className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input placeholder="Expiry date: MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} maxLength={4} type="password"
            className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input placeholder="Card pin" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={4} type="password"
            className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 sm:col-span-2" />
        </div>
      </div>

      <OrderSummary
        title="Payment amount"
        fee={fee}
        charges={charges}
        showCharges
        btnLabel="Checkout"
        btnActive={isReady}
        onBtn={onCheckout}
      />
    </div>
  );
}

/* ══════════════════════════════════
   SCREEN 4: Success
══════════════════════════════════ */
function ScreenSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-3">
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-2">
        <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-green-500 fill-none" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900">Payment successful</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        Copy your receipt has been sent to this email:{" "}
        <span className="font-bold text-gray-800">{USER_EMAIL}</span>
      </p>
    </div>
  );
}

/* ══════════════════════════════════
   ROOT — orchestrates everything
══════════════════════════════════ */
 function PaymentFlow({ onBack }: { onBack?: () => void }) {
  const [screen, setScreen] = useState<Screen>("form");
  const [method, setMethod] = useState<Method>(null);
  const [fee, setFee]       = useState(0);

  const isCheckout = screen === "method" || screen === "transfer" || screen === "card";

  const handleBack = () => {
    if (screen === "form")     onBack?.();
    if (screen === "method")   setScreen("form");
    if (screen === "transfer") setScreen("method");
    if (screen === "card")     setScreen("method");
  };

  return (
    <div className="min-h-screen bg-white p-6 sm:p-10">
      {/* Back + title */}
      {screen !== "success" && (
        <div className="flex items-center gap-3 mb-6">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="Go back">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="text-sm font-semibold text-gray-900">Payment for viewing center</h1>
        </div>
      )}

      {/* Stepper */}
      {screen !== "success" && (
        <Stepper active={isCheckout ? "checkout" : "info"} />
      )}

      {/* Screens */}
      {screen === "form"     && <ScreenForm     onNext={(f) => { setFee(f); setScreen("method"); }} />}
      {screen === "method"   && <ScreenMethod   fee={fee} method={method} setMethod={setMethod} onContinue={() => setScreen(method === "card" ? "card" : "transfer")} />}
      {screen === "transfer" && <ScreenTransfer fee={fee} onPaid={() => setScreen("success")} />}
      {screen === "card"     && <ScreenCard     fee={fee} onCheckout={() => setScreen("success")} />}
      {screen === "success"  && <ScreenSuccess />}
    </div>
  );
}