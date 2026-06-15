"use client";

import { useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
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
} from "lucide-react";
import { Ticket as TicketIcon } from "lucide-react";
import { useGetTicketByIdQuery, usePurchaseTicketMutation } from '@/redux/slices/apiSlice';

// ─── Types ────────────────────────────────────────────────────────────────────

type CreateStep = "describe" | "tickets";
type BuyStep = "choose" | "contact" | "checkout" | "transfer" | "card" | "success";
type Method = "card" | "transfer" | null;

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

type Event = { id: number; title: string; organizer?: { bank_name?: string; account_number?: string; account_name?: string }; tickets?: Ticket[] };
type Ticket = { id: number; name: string; price: string; ticket_image?: string };

export function PurchaseTicketFlow({ 
  onClose, 
  event 
}: { 
  onClose: () => void; 
  event?: EventData;
}) {
  const organizerBank = event?.organizer;
  const BANK_NAME = organizerBank?.bank_name || "";
  const ACCT_NUMBER = organizerBank?.account_number || "";
  const ACCT_NAME = organizerBank?.account_name || organizerBank?.full_name || "";

  const [step, setStep] = useState<BuyStep>("choose");
  const [method, setMethod] = useState<Method>(null);
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTicketIndex, quantity, contactInfo, purchaseLoading, purchaseSuccess } = useSelector((state: RootState) => state.tickets);

  const [purchaseTicketMutation] = usePurchaseTicketMutation();

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

  const copy = () => {
    navigator.clipboard.writeText(ACCT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Real purchase submission using the event's ticket id
  const handleRealPurchase = async () => {
    dispatch(purchaseStart());

    try {
      const payload: any = {
        ticket_id: selectedRealTicket?.id ?? currentDisplayTicket?.id,
        quantity,
        full_name: contactInfo.fullName,
        email: contactInfo.email,
      };

      // Include event_id when we have real event data
      if (eventId) {
        payload.event_id = eventId;
      }

      await purchaseTicketMutation(payload).unwrap();

      // dispatch(purchaseSuccess());
      setStep("success");
    } catch (err: any) {
      const message = err?.data?.detail || err?.data?.message || "Purchase failed. Please try again.";
      // We can dispatch purchaseFailure if we want to show error in UI
      console.error("Purchase error:", err);
      alert(message); // temporary until we add better error UI
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
    <div className="flex-1 bg-[#F5F5F5] min-h-screen p-6 overflow-y-auto">
      {/* Go back */}
      <button
        onClick={() => {
          if (step === "choose") onClose();
          else if (step === "contact") setStep("choose");
          else if (step === "checkout") setStep("contact");
          else if (step === "transfer" || step === "card") setStep("checkout");
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
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Payment method</h2>
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
            </>
          )}

          {/* STEP: Bank Transfer */}
          {step === "transfer" && (
            <>
              <h2 className="text-sm font-bold text-gray-900 mb-1">Paying through Bank Transfer</h2>
              <p className="text-sm text-gray-500 mb-4">
                {ACCT_NUMBER
                  ? "Make payment to the event organizer's account below:"
                  : "Bank transfer details unavailable. Please contact the event organizer for payment details."}
              </p>

              {ACCT_NUMBER ? (
                <div className="border border-gray-200 rounded-xl px-6 py-5 inline-block min-w-[260px]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl sm:text-3xl font-bold text-[#2338e0] tracking-wide">{ACCT_NUMBER}</span>
                    <button onClick={copy} title="Copy account number" className="text-gray-400 hover:text-gray-700 transition-colors">
                      {copied ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth={1.8}>
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    {BANK_NAME && (
                      <div className="flex justify-between text-gray-600">
                        <span className="font-medium">Bank:</span>
                        <span className="text-[#2338e0] font-semibold">{BANK_NAME}</span>
                      </div>
                    )}
                    {ACCT_NAME && (
                      <div className="flex justify-between text-gray-600">
                        <span className="font-medium">Account Name:</span>
                        <span className="font-semibold">{ACCT_NAME}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border border-orange-200 bg-orange-50 rounded-xl px-6 py-5 text-sm text-orange-700">
                  <p className="font-medium mb-1">No bank details available</p>
                  <p className="text-xs text-orange-600">The event organizer has not provided bank transfer details yet. Please reach out to them directly or try another payment method.</p>
                </div>
              )}
            </>
          )}

          {/* STEP: Bank Card */}
          {step === "card" && (
            <>
              <h2 className="text-sm font-bold text-gray-900 mb-1">Paying through Bank Card</h2>
              <p className="text-sm text-gray-500 mb-4">Add your bank card to make payment</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input placeholder="Bank name" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input placeholder="Card number" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" inputMode="numeric" maxLength={19} />
                <input placeholder="Expiry date: MM/YY" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input placeholder="CVV" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" maxLength={4} type="password" />
                <input placeholder="Card pin" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 sm:col-span-1" maxLength={4} type="password" />
              </div>
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
            else if (step === "contact" && contactValid) setStep("checkout");
            else if (step === "checkout" && method) {
              setStep(method as "transfer" | "card");
            }
            else if (step === "transfer" || step === "card") {
              await handleRealPurchase();
            }
          }}
          actionDisabled={(step === "contact" && !contactValid) || (step === "checkout" && !method) || purchaseLoading}
          actionLabel={purchaseLoading ? "Processing..." : step === "transfer" ? "I have paid" : step === "card" ? "Checkout" : step === "checkout" ? "Continue" : "Continue"}
        />
      </div>
    </div>
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