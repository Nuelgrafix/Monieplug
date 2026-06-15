"use client";

import { ArrowLeft, CheckCircle2, ChevronDown, Eye, EyeOff, Search, X } from "lucide-react";
import React, { useMemo, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  useGetBanksQuery,
  useTransferFundsMutation,
  useSetPinMutation,
  useVerifyAccountMutation,
} from "@/redux/slices/apiSlice";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Backdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      {children}
    </div>
  );
}

// PIN entry that auto-advances (copied from signup pattern)
function PinDigit({
  value,
  onChange,
  show,
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
}) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplay(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ch = e.target.value.replace(/\D/, "").slice(-1);
    setDisplay(ch);
    onChange(ch);
    if (ch && ref.current) ref.current.blur(); // close soft keyboard
  };

  return (
    <input
      ref={ref}
      type={show ? "text" : "password"}
      inputMode="numeric"
      maxLength={1}
      value={display}
      onChange={handleChange}
      className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E35C8]"
    />
  );
}

// ─── Flow Modal types ─────────────────────────────────────────────────────────

type ModalKind = null | "confirm" | "password" | "create-pin";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SendMoneyFlow() {
  const router = useRouter();
  const currentUser: any = useSelector((state: RootState) => state.auth.user);
  const [revealCreatePin, setRevealCreatePin] = useState(false);

  // ── RTK hooks ──────────────────────────────────────────────────────────────
  const { data: banksData, error: banksError, isLoading: banksLoading } = useGetBanksQuery(undefined);

  const [transferFunds, { isLoading: transferLoading }] = useTransferFundsMutation();
  const [setPin, { isLoading: pinLoading }] = useSetPinMutation();
  const [verifyAccount, { isLoading: verifyingAccount }] = useVerifyAccountMutation();

  // ── Parse banks from various response shapes ───────────────────────────────
const banks: string[] = useMemo(() => {
  const list =
    (banksData as any)?.banks ??
    (banksData as any)?.raw_data?.data?.bankList ??
    (banksData as any)?.data?.bankList ??
    (Array.isArray(banksData) ? banksData : null);

  if (!Array.isArray(list)) return [];
  return list.map((b: any) => b.bankName || b.name || b.bank_name).filter(Boolean);
}, [banksData]);

// ── Bank name → code map ──────────────────────────────────────────────────
useEffect(() => {
  const list =
    (banksData as any)?.banks ??
    (banksData as any)?.raw_data?.data?.bankList ??
    (banksData as any)?.data?.bankList ??
    (Array.isArray(banksData) ? banksData : null);

  if (!Array.isArray(list)) return;
  const map: Record<string, string> = {};
  list.forEach((b: any) => {
    const name = b.bankName || b.name || b.bank_name;
    const code = b.bankCode || b.nibssBankCode || b.code || b.bank_code;
    if (name && code) map[name] = code;
  });
  setBankCodeMap(map);
}, [banksData]);

  // ── Step / modal state ──────────────────────────────────────────────────────
  const [step, setStep] = useState<"account" | "amount" | "success">("account");
  const [modal, setModal] = useState<ModalKind>(null);

  // ── Account details ─────────────────────────────────────────────────────────
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankOpen, setBankOpen] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  // ── Amount ──────────────────────────────────────────────────────────────────
  const [amount, setAmount] = useState("");

  // ── PIN ─────────────────────────────────────────────────────────────────
  const [pinValues, setPinValues] = useState<string[]>(["", "", "", ""]);
  const [showPin, setShowPin] = useState(false);

  // ── PIN creation (for users without a PIN) ──────────────────────────────────
  const [createPin, setCreatePin] = useState("");
  const [createPinValues, setCreatePinValues] = useState<string[]>(["", "", "", ""]);
  const [showCreatePin, setShowCreatePin] = useState(false);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const isAcctComplete = accountNumber.length === 10;
  const isBankComplete = selectedBank !== "";
  const accountCanProceed = isAcctComplete && isBankComplete;
  const amountCanProceed = Number(amount) > 0;
  const formatted = amount ? `₦${Number(amount).toLocaleString()}` : "₦0";
  const formattedAmountNum = Number(amount);

  // Filter banks based on search term
  const filteredBanks = useMemo(() => {
    if (!bankSearch) return banks;
    return banks.filter((b) => b.toLowerCase().includes(bankSearch.toLowerCase()));
  }, [banks, bankSearch]);

  // ── Bank name → code mapping (for verifyAccount payload) ────────────────────
  // The API expects a bank *code* (e.g. "058") not display name. Map from the data we get back.
  const [bankCodeMap, setBankCodeMap] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!banksData) return;
    const map: Record<string, string> = {};
    const list =
      (banksData as any)?.banks ??
      (banksData as any)?.raw_data?.data?.bankList ??
      (banksData as any)?.data?.bankList ??
      (Array.isArray(banksData) ? banksData : null);

    if (Array.isArray(list)) {
      list.forEach((b: any) => {
        const name = b.bankName || b.name || b.bank_name;
        const code = b.bankCode || b.nibssBankCode || b.code || b.bank_code;
        if (name && code) map[name] = code;
      });
    }
    setBankCodeMap(map);
  }, [banksData]);

  // ── Resolve account name via /authent/verify-account/ ─────────────────────
  useEffect(() => {
    if (!isAcctComplete || !isBankComplete) {
      setAccountName("");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const code = selectedBank && bankCodeMap[selectedBank]
          ? bankCodeMap[selectedBank]
          : selectedBank; // fall back to raw name if no code map yet
        const result = await verifyAccount({
          account_number: accountNumber,
          bank: code,
        }).unwrap();
        if (!cancelled && result) {
          const name =
            result.account_name ||
            result.name ||
            result.fullName ||
            result.accountName ||
            "Unknown Account";
          setAccountName(name);
        }
      } catch (err: any) {
        if (!cancelled) {
          setAccountName("Account found (name unavailable)");
          toast.error(err?.data?.message || "Could not fully verify account, but you may continue.");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [isAcctComplete, isBankComplete, accountNumber, selectedBank, bankCodeMap, verifyAccount]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAccountNext = () => {
    if (accountCanProceed && !verifyingAccount) {
      setStep("amount");
    }
  };

  const handleSend = () => {
    if (amountCanProceed) setModal("confirm");
  };

  const handleConfirm = () => {
    if (currentUser?.has_pin === false) {
      setModal(null);
      setShowCreatePin(true);
    } else {
      setModal("password");
    }
  };

  const handlePasswordSend = () => {
    // handler used to close the modal, now unused — transferred to handleTransfer
    setModal(null);
  };

  // Create PIN and then trigger the transfer
  const handleCreatePin = async () => {
    const newPin = createPinValues.join("");
    if (newPin.length < 4) {
      toast.error("PIN must be at least 4 digits");
      return;
    }
    try {
      await setPin({ pin: newPin }).unwrap();
      toast.success("PIN created successfully!");
      setShowCreatePin(false);
      // After creating pin, proceed to password (transfer pin) entry
      setModal("password");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to set PIN");
    }
  };

  const handleTransfer = async () => {
  const pinCode = pinValues.join("");
  if (pinCode.length < 4) return;

  setModal(null);
  try {
    const bankCode = bankCodeMap[selectedBank] || selectedBank;

    const payload = {
      account_number: accountNumber,   // ← was `phone`
      bank_code: bankCode,             // send code, not display name
      amount: formattedAmountNum,
      pin: pinCode,                    // include the PIN in the transfer
      ...(accountName && { account_name: accountName }),
    };

    await transferFunds(payload).unwrap();
    toast.success("Transfer successful!");
    setStep("success");
  } catch (err: any) {
    toast.error(err?.data?.message || "Transfer failed");
  }
};

  // ─────────────────────────────────────────────────────────────────────────
  // SUCCESS
  // ─────────────────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center text-center">
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
            onClick={() => router.push("/dashboard/home")}
            className="mt-8 w-full py-3 rounded-xl bg-[#1E35C8] text-white text-sm font-semibold hover:bg-[#1a2eb0] active:scale-[0.98] transition-all"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACCOUNT DETAILS
  // ─────────────────────────────────────────────────────────────────────────
  if (step === "account") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
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
<div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
  <div className="p-2 border-b border-gray-200">
    <div className="relative">
      <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search banks..."
        value={bankSearch}
        onChange={(e) => setBankSearch(e.target.value)}
        className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#1E35C8]"
      />
      {bankSearch && (
        <button
          onClick={() => setBankSearch("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={14} />
        </button>
      )}
    </div>
  </div>
  <ul className="max-h-52 overflow-y-auto">
    {banksLoading ? (
      <li className="px-4 py-2 text-sm text-gray-400">Loading banks…</li>
    ) : banksError ? (
      <li className="px-4 py-2 text-sm text-red-400">Failed to load banks. Try again.</li>
    ) : filteredBanks.length > 0 ? (
      filteredBanks.map((bank) => (
        <li
          key={bank}
          onClick={() => { setSelectedBank(bank); setBankOpen(false); setBankSearch(""); }}
          className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
            selectedBank === bank
              ? "bg-[#1E35C8]/10 text-[#1E35C8] font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          {bank}
        </li>
      ))
    ) : (
      <li className="px-4 py-2 text-sm text-gray-400">No banks found</li>
    )}
  </ul>
</div>
)}
            </div>
          </div>

          {/* Step 3 – Account Name (auto-resolved via verifyAccount) */}
          {isAcctComplete && isBankComplete && (
            <div className="bg-[#F9F9F9] rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={18} className={accountName ? "text-[#1E35C8]" : "text-gray-300"} strokeWidth={2} />
                <span className="text-sm font-semibold text-gray-800">3. Account Name</span>
              </div>
              <input
                readOnly
                value={verifyingAccount ? "Resolving…" : accountName || "Account found"}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white cursor-default focus:outline-none"
              />
            </div>
          )}

          {/* Next */}
          <button
            onClick={handleAccountNext}
            disabled={!accountCanProceed || verifyingAccount}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${accountCanProceed && !verifyingAccount ? "bg-[#1E35C8] text-white hover:bg-[#1a2eb0] active:scale-[0.98] shadow-sm" : "bg-[#1E35C8]/40 text-white/70 cursor-not-allowed"}`}
          >
            {verifyingAccount ? "Verifying…" : "Next"}
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ENTER AMOUNT + MODALS
  // ─────────────────────────────────────────────────────────────────────────
  const pinCode = pinValues.join("");
  const createPinCode = createPinValues.join("");

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className={`w-full max-w-md bg-white rounded-2xl shadow-sm p-6 transition-all ${modal || showCreatePin ? "opacity-40 pointer-events-none select-none" : ""}`}>
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
            {[1000, 5000, 10000, 100000].map((amt) => (
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

      {/* ── PASSWORD (transfer PIN) MODAL */}
      {modal === "password" && (
        <Backdrop>
          <div className="bg-white rounded-2xl shadow-xl w-[320px] p-6 text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Enter transfer PIN</h2>
            <p className="text-xs text-gray-400 mb-5">Enter your 4-digit PIN to confirm</p>
            <div className="flex justify-center gap-2 mb-5">
              {pinValues.map((v, i) => (
                <PinDigit
                  key={i}
                  value={v}
                  onChange={(ch) => {
                    const next = [...pinValues];
                    next[i] = ch;
                    setPinValues(next);
                  }}
                  show={showPin}
                />
              ))}
            </div>
            <button
              onClick={() => setShowPin((p) => !p)}
              className="text-xs text-gray-400 hover:text-gray-600 mb-5"
            >
              {showPin ? "Hide" : "Show"}
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => { setModal(null); setPinValues(["", "", "", "", "", ""]); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={pinCode.length !== 4}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${pinCode.length < 4 ? "bg-[#1E35C8]/40 text-white/70 cursor-not-allowed" : "bg-[#1E35C8] text-white hover:bg-[#1a2eb0] active:scale-[0.98]"}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </Backdrop>
      )}

      {/* ── CREATE PIN MODAL */}
      {showCreatePin && (
        <Backdrop>
          <div className="bg-white rounded-2xl shadow-xl w-[320px] p-6 text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Create a transfer PIN</h2>
            <p className="text-xs text-gray-400 mb-5">This PIN protects your transfers. You'll need it every time you send money.</p>
            <div className="flex justify-center gap-2 mb-5">
              {createPinValues.map((v, i) => (
                <PinDigit
                  key={i}
                  value={v}
                  onChange={(ch) => {
                    const next = [...createPinValues];
                    next[i] = ch;
                    setCreatePinValues(next);
                  }}
                  show={revealCreatePin}
                />
              ))}
            </div>
            <button onClick={() => setRevealCreatePin(p => !p)}>
              {revealCreatePin ? "Hide" : "Show"}
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowCreatePin(false); setCreatePinValues(["", "", "", ""]); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePin}
                disabled={pinLoading || createPinCode.length < 4}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${pinLoading || createPinCode.length < 4 ? "bg-[#FF6B00]/40 text-white/70 cursor-not-allowed" : "bg-[#FF6B00] text-white hover:bg-[#e05f00] active:scale-[0.98]"}`}
              >
                {pinLoading ? "Saving…" : "Save PIN"}
              </button>
            </div>
          </div>
        </Backdrop>
      )}
    </div>
  );
}
