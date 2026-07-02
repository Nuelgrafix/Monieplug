"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import toast from "react-hot-toast";
import {
  selectTicket,
  setQuantity,
  updateContactInfo,
  purchaseStart,
  purchaseSuccess,
  purchaseFailure,
  resetTicketFlow,
} from '@/redux/slices/ticketsSlice';
import {
  X,
  ArrowLeft,
  Camera,
  CalendarDays,
  Plus,
  Minus,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { Ticket as TicketIcon } from "lucide-react";
import { useGetTicketByIdQuery, useEwalletCheckoutMutation, useCheckTransactionPinQuery, useSetPinMutation } from '@/redux/slices/apiSlice';
import Modal from '@/components/Modal';

// ─── Types ────────────────────────────────────────────────────────────────────

type CreateStep = "describe" | "tickets";
type BuyStep = "choose" | "contact" | "checkout" | "success";

interface TicketVariation {
  id: number;
  name: string;
  fee: string;
  image: string;
  date: string;
}

type TicketOption = { id: number; name: string; price: string; ticket_image?: string };
type Organizer = { bank_name?: string; account_number?: string; account_name?: string; full_name?: string; email?: string; phone?: string };
type EventData = { id: number; title: string; organizer?: Organizer; tickets?: TicketOption[] };

const TICKET_OPTIONS = [
  { label: "Regular", price: 13000, color: "bg-orange-100 text-orange-500" },
  { label: "Standard", price: 50000, color: "bg-blue-100 text-blue-500" },
  { label: "Premium", price: 100000, color: "bg-indigo-100 text-indigo-500" },
];

const CHARGES = 250;

// ─── Modern PIN Input ────────────────────────────────────────────────────────

function PinDots({ length, error }: { length: number; error?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ease-out ${
            i < length
              ? error
                ? "bg-red-500 scale-110"
                : "bg-[#1E35C8] scale-110 shadow-[0_0_12px_rgba(30,53,200,0.4)]"
              : error
                ? "bg-red-200"
                : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return `₦${n.toLocaleString()}`;
}

function Backdrop({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
      {children}
    </div>
  );
}

// ─── Stepper ─────────────────────────────────────────────────────────────────

function Stepper({ current }: { current: BuyStep }) {
  const steps: BuyStep[] = ["choose", "contact", "checkout"];
  const labels = ["Tickets", "Contact", "Checkout"];
  const currentIdx = steps.indexOf(current);

  return (
    <div className="flex items-center gap-0 mb-6">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full border-2 transition-colors ${
                i <= currentIdx
                  ? "bg-orange-400 border-orange-400"
                  : "bg-white border-gray-300"
              }`}
            />
            <span className="text-[10px] text-gray-500 mt-1">{labels[i]}</span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-20 sm:w-32 mx-1 mb-3 transition-colors ${
                i < currentIdx ? "bg-orange-400" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Order Summary sidebar ────────────────────────────────────────────────────

function OrderSummary({
  ticketPrice,
  qty = 1,
  isCheckout = false,
  onAction,
  actionDisabled = false,
  actionLabel = "Continue",
  fee,
  charges: chargesProp,
}: {
  ticketPrice?: number;
  qty?: number;
  isCheckout?: boolean;
  onAction: () => void;
  actionDisabled?: boolean;
  actionLabel?: string;
  fee?: number;
  charges?: number;
}) {
  const charges = chargesProp ?? CHARGES;
  const ticketFee = fee ?? (ticketPrice ?? 0) * qty;
  const subtotal = ticketFee + charges;
  return (
    <div className="w-full sm:w-64 flex-shrink-0 bg-white rounded-2xl p-5 shadow-sm self-start">
      <h3 className="text-base font-bold text-gray-900 mb-4">Order Summary</h3>
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between text-gray-600">
          <span>{isCheckout ? `Summary (${qty} ticket${qty > 1 ? 's' : ''})` : "Ticket fee"}</span>
          <span>{fmt(ticketFee)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Charges</span>
          <span>{fmt(charges)}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2 mt-2">
          <span>{isCheckout ? "Total" : "Subtotal"}</span>
          <span>{fmt(subtotal)}</span>
        </div>
      </div>
      <button
        onClick={onAction}
        disabled={actionDisabled}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
          actionDisabled
            ? "bg-[#1E35C8]/40 text-white/70 cursor-not-allowed"
            : "bg-[#1E35C8] text-white hover:bg-[#1a2eb0] active:scale-[0.98]"
        }`}
      >
        {actionLabel}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREATE EVENT MODAL  (screens 1 + 2 + 3)
// ═══════════════════════════════════════════════════════════════════════════════

export function CreateEventModal({ onClose }: { onClose?: () => void }) {
  const [step, setStep] = useState<CreateStep>("describe");
  const [description, setDescription] = useState("");
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ticket form state
  const [mainTicket, setMainTicket] = useState({ name: "", fee: "", image: "", date: "" });
  const [variations, setVariations] = useState<TicketVariation[]>([
    { id: Date.now(), name: "", fee: "", image: "", date: "" },
  ]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewImg(url);
  };

  const addVariation = () =>
    setVariations((v) => [...v, { id: Date.now(), name: "", fee: "", image: "", date: "" }]);

  const updateVariation = (id: number, field: keyof TicketVariation, value: string) =>
    setVariations((v) => v.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ── STEP 1: Describe event ── */}
        {step === "describe" && (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-orange-200">
                  <img
                    src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=Emmanuel"
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-semibold text-gray-800">Emmanuel Nwankwo</span>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500">
                <X size={16} />
              </button>
            </div>

            {/* Textarea */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your event"
              rows={12}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 resize-none mb-4"
            />

            {/* Image preview */}
            {previewImg && (
              <div className="rounded-xl overflow-hidden mb-4 max-h-56">
                <img src={previewImg} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Bottom row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500"
                >
                  <Camera size={16} />
                </button>
                {previewImg && (
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#1E35C8]">
                    <img src={previewImg} alt="thumb" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <button
                onClick={() => setStep("tickets")}
                disabled={!description.trim()}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  description.trim()
                    ? "bg-[#1E35C8] text-white hover:bg-[#1a2eb0] active:scale-[0.98]"
                    : "bg-[#1E35C8]/40 text-white/70 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Ticket price & date ── */}
        {step === "tickets" && (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setStep("describe")} className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                <ArrowLeft size={16} /> Go back
              </button>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500">
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Main ticket */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Enter event ticket price and Date</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      placeholder="Name e.g Regular"
                      value={mainTicket.name}
                      onChange={(e) => setMainTicket({ ...mainTicket, name: e.target.value })}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30"
                    />
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-32">
                      <TicketIcon size={14} className="text-gray-400" />
                      <input
                        placeholder="Ticket fee"
                        value={mainTicket.fee}
                        onChange={(e) => setMainTicket({ ...mainTicket, fee: e.target.value })}
                        className="w-full focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                  <input
                    placeholder="Add ticket image"
                    value={mainTicket.image}
                    onChange={(e) => setMainTicket({ ...mainTicket, image: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30"
                  />
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
                    <CalendarDays size={14} className="text-gray-400" />
                    <input
                      placeholder="MM/DD/YY"
                      value={mainTicket.date}
                      onChange={(e) => setMainTicket({ ...mainTicket, date: e.target.value })}
                      className="w-full focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px bg-gray-100" />

              {/* Variations */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Ticket variation</h3>
                {variations.map((v) => (
                  <div key={v.id} className="space-y-3 mb-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                      <span className="text-xs text-gray-500">This ticket has variation</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        placeholder="Name e.g Regular"
                        value={v.name}
                        onChange={(e) => updateVariation(v.id, "name", e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30"
                      />
                      <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-32">
                        <TicketIcon size={14} className="text-gray-400" />
                        <input
                          placeholder="Ticket fee"
                          value={v.fee}
                          onChange={(e) => updateVariation(v.id, "fee", e.target.value)}
                          className="w-full focus:outline-none text-sm"
                        />
                      </div>
                    </div>
                    <input
                      placeholder="Add ticket image"
                      value={v.image}
                      onChange={(e) => updateVariation(v.id, "image", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30"
                    />
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
                      <CalendarDays size={14} className="text-gray-400" />
                      <input
                        placeholder="MM/DD/YY"
                        value={v.date}
                        onChange={(e) => updateVariation(v.id, "date", e.target.value)}
                        className="w-full focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addVariation}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Publish */}
            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-[#1E35C8] text-white text-sm font-semibold hover:bg-[#1a2eb0] active:scale-[0.98] transition-all shadow-sm"
              >
                Publish event
              </button>
            </div>
          </div>
        )}
      </div>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PURCHASE TICKET FLOW  (screens 4 → 5 → 6 → 7)
// ═══════════════════════════════════════════════════════════════════════════════

export function PurchaseTicketFlow({ 
  onClose,
  event
}: {
  onClose: () => void;
  event?: EventData;
}) {
  const [step, setStep] = useState<BuyStep>("choose");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTicketIndex, quantity, contactInfo, purchaseLoading, purchaseSuccess } = useSelector((state: RootState) => state.tickets);

  const [ewalletCheckoutMutation] = useEwalletCheckoutMutation();
  const [setPinMutation] = useSetPinMutation();
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");
  const [settingPin, setSettingPin] = useState(false);
  const [showIncorrectPinModal, setShowIncorrectPinModal] = useState(false);

  const { data: pinCheckData, isLoading: pinCheckLoading, isSuccess: pinCheckSuccess, isError: pinCheckError } = useCheckTransactionPinQuery(undefined, {
    skip: step !== "checkout",
  });
  const [pinSetLocally, setPinSetLocally] = useState(false);

  const serverSaysNoPin = pinCheckError || (pinCheckData && pinCheckData.pin_set === false);
  const serverSaysHasPin = pinSetLocally || (pinCheckData && pinCheckData.pin_set === true);
  const hasPin = serverSaysHasPin && !serverSaysNoPin;

  useEffect(() => {
    if (pinCheckData?.pin_set === true) {
      setPinSetLocally(false);
    }
  }, [pinCheckData?.pin_set]);

  // Use real tickets from the event (integrated from /event/events/{id}/) or fallback
  const realTickets = event?.tickets || [];
  const hasRealTickets = realTickets.length > 0;
  const eventId = event?.id;

  const displayTickets = hasRealTickets
    ? realTickets.map((t: any, idx: number) => ({
        id: t.id,
        label: t.name || `Ticket ${idx + 1}`,
        price: parseFloat(t.price) || 0,
        color: "bg-orange-100 text-orange-500",
        ticket_image: t.ticket_image,
        original: t,
      }))
    : TICKET_OPTIONS.map((t: any, i: number) => ({ 
        ...t, 
        id: i, 
        label: t.label, 
        price: t.price 
      }));

  // Currently selected ticket (real or fallback)
  const currentDisplayTicket = displayTickets[selectedTicketIndex] || displayTickets[0];
  const ticket = {
    label: currentDisplayTicket?.label,
    price: currentDisplayTicket?.price || 0,
  };

  // Real selected ticket object (for purchase payload)
  const selectedRealTicket = hasRealTickets ? realTickets[selectedTicketIndex] : null;

  // Integrate /event/tickets/{id}/ — fetch full details for the selected real ticket
  const { data: ticketDetails } = useGetTicketByIdQuery(
    selectedRealTicket?.id ?? 0,
    { skip: !selectedRealTicket?.id }
  );
  const emailsMatch = contactInfo.email && contactInfo.email === contactInfo.confirmEmail;
  const contactValid = contactInfo.fullName.trim() && emailsMatch;
  const pinValid = contactInfo.transactionPin.length >= 4;

  const handleSetPin = async () => {
    if (newPin.length < 4 || newPin !== confirmNewPin) return;
    setSettingPin(true);
    try {
      await setPinMutation({ pin: newPin }).unwrap();
      setNewPin("");
      setConfirmNewPin("");
      setPinSetLocally(true);
      await handleRealPurchase(newPin);
    } catch (err: any) {
      const message = err?.data?.detail || err?.data?.message || "Failed to set PIN.";
      toast.error(message);
    } finally {
      setSettingPin(false);
    }
  };

  // Real purchase submission using the event's ticket id
  const handleRealPurchase = async (pin?: string) => {
    dispatch(purchaseStart());

    try {
      const payload = {
        ticket_id: selectedRealTicket?.id ?? currentDisplayTicket?.id,
        copies: quantity,
        full_name: contactInfo.fullName,
        email: contactInfo.email,
        transaction_pin: pin ?? contactInfo.transactionPin,
      };

      await ewalletCheckoutMutation(payload).unwrap();

      setStep("success");
    } catch (err: any) {
      console.error("Ewallet checkout error:", err);

      const message =
        err?.data?.details?.message ||
        err?.data?.detail ||
        err?.data?.message ||
        err?.data?.error ||
        "Checkout failed. Please try again.";

      const pinNotSet =
        message.toLowerCase().includes("not set") ||
        message.toLowerCase().includes("no pin") ||
        message.toLowerCase().includes("pin is required") ||
        message.toLowerCase().includes("set your pin") ||
        message.toLowerCase().includes("create a pin");

      const pinIncorrect =
        message.toLowerCase().includes("incorrect") ||
        message.toLowerCase().includes("invalid pin") ||
        message.toLowerCase().includes("wrong pin") ||
        message.toLowerCase().includes("pin mismatch") ||
        message.toLowerCase().includes("does not match");

      if (pinNotSet) {
        dispatch(purchaseFailure(message));
        router.push("/dashboard/set-pin");
        return;
      }

      if (pinIncorrect) {
        setShowIncorrectPinModal(true);
        dispatch(purchaseFailure(message));
        return;
      }

      toast.error(message);
      dispatch(purchaseFailure(message));
    }
  };

  if (step === "success" || purchaseSuccess) {
    return (
      <div className="flex-1 bg-[#F5F5F5] min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle2 size={36} className="text-green-500" strokeWidth={1.8} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Ticket purchase successful</h2>
          <p className="text-sm text-gray-500">
            Copy your ticket has been sent to this email:{" "}
            <span className="font-bold text-gray-800">{contactInfo.email || "email@gmail.com"}</span>
          </p>
          <button
            onClick={() => {
              dispatch(resetTicketFlow());
              onClose();
            }}
            className="mt-8 px-8 py-3 rounded-xl bg-[#1E35C8] text-white text-sm font-semibold hover:bg-[#1a2eb0] transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="flex-1 bg-[#F5F5F5] min-h-screen p-6 overflow-y-auto">
      {/* Go back */}
      <button
        onClick={() => {
          if (step === "choose") onClose();
          else if (step === "contact") setStep("choose");
          else if (step === "checkout") { setStep("contact"); }
        }}
        className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={16} /> Go back
      </button>

      {/* Stepper */}
      <Stepper current={step} />

      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* ── Left panel ── */}
        <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm">

          {/* STEP: Choose ticket */}
          {step === "choose" && (
            <>
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Choose a ticket</h2>
               {hasRealTickets && displayTickets.length === 0 ? (
                <div className="text-sm text-gray-500 py-4">
                  No tickets available for this event yet.
                </div>
              ) : (
                <div className="flex gap-3 flex-wrap">
                  {displayTickets.map((t: any, i: number) => (
                    <button
                      key={t.id ?? i}
                      onClick={() => dispatch(selectTicket(i))}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all w-28 overflow-hidden ${
                        selectedTicketIndex === i ? "border-orange-400 shadow-sm" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {hasRealTickets && t.ticket_image ? (
                        <img 
                          src={t.ticket_image} 
                          alt={t.label}
                          className="w-10 h-10 rounded-xl object-cover mb-2" 
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${t.color}`}>
                          <TicketIcon size={18} />
                        </div>
                      )}
                      <span className="text-xs text-gray-500 mb-0.5">{t.label}</span>
                      <span className="text-sm font-bold text-gray-900">{fmt(t.price)}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STEP: Contact */}
          {step === "contact" && (
            <>
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Get your ticket copy</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  placeholder="Full name"
                  value={contactInfo.fullName}
                  onChange={(e) => dispatch(updateContactInfo({ fullName: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={contactInfo.email}
                  onChange={(e) => dispatch(updateContactInfo({ email: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30"
                />
                {/* Qty picker */}
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-400">
                  <span className="flex-1">Copy of ticket</span>
                  <button onClick={() => dispatch(setQuantity(quantity - 1))} className="text-gray-500 hover:text-gray-800">
                    <Minus size={14} />
                  </button>
                  <span className="text-gray-800 font-medium w-4 text-center">{quantity}</span>
                  <button onClick={() => dispatch(setQuantity(quantity + 1))} className="text-gray-500 hover:text-gray-800">
                    <Plus size={14} />
                  </button>
                </div>
                <input
                  type="email"
                  placeholder="Confirm email address"
                  value={contactInfo.confirmEmail}
                  onChange={(e) => dispatch(updateContactInfo({ confirmEmail: e.target.value }))}
                  className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 ${
                    contactInfo.confirmEmail && !emailsMatch ? "border-red-300" : "border-gray-200"
                  }`}
                />
              </div>
              <p className="text-xs text-[#1E35C8]">
                Note: your ticket will be sent to the email provided above, please provide a valid email.
              </p>
            </>
          )}

          {/* STEP: Checkout / Payment */}
          {step === "checkout" && (
            <>
              {pinCheckLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-8 h-8 border-2 border-[#1E35C8] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-gray-400">Checking your account…</p>
                </div>
              ) : hasPin ? (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#1E35C8]/10 flex items-center justify-center mb-4">
                    <Lock size={24} className="text-[#1E35C8]" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900 mb-1">Enter your PIN</h2>
                  <p className="text-sm text-gray-400 mb-8 text-center max-w-[260px]">
                    Enter your 4-digit transaction PIN to pay from your wallet
                  </p>

                  <SegmentedPinInput
                    value={contactInfo.transactionPin}
                    onChange={(val) => dispatch(updateContactInfo({ transactionPin: val }))}
                  />

                  <div className="mt-6">
                    <PinDots length={contactInfo.transactionPin.length} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
                    <ShieldCheck size={24} className="text-amber-500" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900 mb-1">Create your PIN</h2>
                  <p className="text-sm text-gray-400 mb-8 text-center max-w-[280px]">
                    Set a 4-digit transaction PIN to secure your wallet payments
                  </p>

                  <SegmentedPinInput
                    value={newPin}
                    onChange={setNewPin}
                    error={confirmNewPin.length > 0 && confirmNewPin !== newPin}
                  />

                  {newPin.length === 4 && (
                    <>
                      <p className="text-xs text-gray-400 mt-6 mb-4">Re-enter your PIN to confirm</p>
                      <SegmentedPinInput
                        value={confirmNewPin}
                        onChange={setConfirmNewPin}
                        error={confirmNewPin.length > 0 && confirmNewPin !== newPin}
                      />
                    </>
                  )}

                  {confirmNewPin.length > 0 && confirmNewPin !== newPin && (
                    <p className="text-xs text-red-500 mt-4 flex items-center gap-1">
                      <X size={12} /> PINs do not match
                    </p>
                  )}
                  {newPin.length === 4 && confirmNewPin === newPin && (
                    <p className="text-xs text-green-600 mt-4 flex items-center gap-1">
                      <CheckCircle2 size={12} /> PINs match
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

         {/* ── Order Summary ── */}
        <OrderSummary
          ticketPrice={step === "checkout" ? undefined : ticket.price}
          qty={quantity}
          isCheckout={step !== "choose" && step !== "contact"}
          fee={step === "checkout" ? ticket.price * quantity : undefined}
          charges={step === "checkout" ? CHARGES : undefined}
          onAction={async () => {
            if (step === "choose") setStep("contact");
            else if (step === "contact" && contactValid) { setStep("checkout"); }
            else if (step === "checkout") {
              if (hasPin && pinValid) {
                await handleRealPurchase();
              } else if (!hasPin && newPin.length >= 4 && newPin === confirmNewPin) {
                await handleSetPin();
              }
            }
          }}
          actionDisabled={
            (step === "contact" && !contactValid) ||
            (step === "checkout" && (
              pinCheckLoading ||
              (hasPin && !pinValid) ||
              (!hasPin && (newPin.length < 4 || newPin !== confirmNewPin))
            )) ||
            purchaseLoading ||
            settingPin
          }
          actionLabel={
            purchaseLoading ? "Processing..." :
            settingPin ? "Setting PIN..." :
            step === "checkout" && !hasPin ? "Set PIN" :
            step === "checkout" ? "Pay from Wallet" :
            "Continue"
          }
        />
      </div>
    </div>

    <Modal
      isOpen={showIncorrectPinModal}
      onClose={() => setShowIncorrectPinModal(false)}
      title="Incorrect PIN"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <X size={24} className="text-red-500" />
        </div>
        <p className="text-sm text-gray-600 text-center">
          The transaction PIN you entered is incorrect. What would you like to do?
        </p>
        <div className="flex gap-3 w-full">
          <button
            onClick={() => {
              setShowIncorrectPinModal(false);
              dispatch(updateContactInfo({ transactionPin: "" }));
            }}
            className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            Try Again
          </button>
          <button
            onClick={() => {
              setShowIncorrectPinModal(false);
              router.push("/dashboard/set-pin");
            }}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#1E35C8] text-white hover:bg-[#1a2eb0] transition-all"
          >
            Create New PIN
          </button>
        </div>
      </div>
    </Modal>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO WRAPPER — delete this if integrating into your own pages
// ═══════════════════════════════════════════════════════════════════════════════

export default function Demo() {
  const [show, setShow] = useState<"none" | "create" | "buy">("none");

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center gap-4 p-8">
      <button
        onClick={() => setShow("create")}
        className="px-6 py-3 bg-[#1E35C8] text-white rounded-xl text-sm font-semibold"
      >
        Create Event Modal
      </button>
      <button
        onClick={() => setShow("buy")}
        className="px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold"
      >
        Purchase Ticket Flow
      </button>

      {show === "create" && <CreateEventModal onClose={() => setShow("none")} />}
      {show === "buy" && <PurchaseTicketFlow onClose={() => setShow("none")} />}
    </div>
  );
}