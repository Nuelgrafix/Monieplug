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
  resetTicketFlow,
} from '@/redux/slices/ticketsSlice';
import {
  X,
  ArrowLeft,
  Camera,
  CalendarDays,
  Ticket,
  Plus,
  Minus,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

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
}: {
  ticketPrice: number;
  qty?: number;
  isCheckout?: boolean;
  onAction: () => void;
  actionDisabled?: boolean;
  actionLabel?: string;
}) {
  const subtotal = ticketPrice * qty + CHARGES;
  return (
    <div className="w-full sm:w-64 flex-shrink-0 bg-white rounded-2xl p-5 shadow-sm self-start">
      <h3 className="text-base font-bold text-gray-900 mb-4">Order Summary</h3>
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between text-gray-600">
          <span>{isCheckout ? `Summary (${qty} ticket)` : "Ticket fee"}</span>
          <span>{fmt(ticketPrice * qty)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Charges</span>
          <span>{fmt(CHARGES)}</span>
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
                      <Ticket size={14} className="text-gray-400" />
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
                        <Ticket size={14} className="text-gray-400" />
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

export function PurchaseTicketFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<BuyStep>("choose");
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTicketIndex, quantity, contactInfo, purchaseLoading, purchaseSuccess } = useSelector((state: RootState) => state.tickets);

  const ticket = TICKET_OPTIONS[selectedTicketIndex];
  const emailsMatch = contactInfo.email && contactInfo.email === contactInfo.confirmEmail;
  const contactValid = contactInfo.fullName.trim() && emailsMatch;

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
              <div className="flex gap-3 flex-wrap">
                {TICKET_OPTIONS.map((t, i) => (
                  <button
                    key={t.label}
                    onClick={() => dispatch(selectTicket(i))}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all w-28 ${
                      selectedTicketIndex === i ? "border-orange-400 shadow-sm" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${t.color}`}>
                      <Ticket size={18} />
                    </div>
                    <span className="text-xs text-gray-500 mb-0.5">{t.label}</span>
                    <span className="text-sm font-bold text-gray-900">{fmt(t.price)}</span>
                  </button>
                ))}
              </div>
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
              <div className="border border-gray-200 rounded-xl p-4 flex items-start gap-3 w-48">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={16} className="text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-800">Pay from Wallet</span>
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                  </div>
                  <p className="text-xs text-[#1E35C8] font-medium">Bal. ₦0.0</p>
                  <p className="text-xs text-orange-500">Insufficient</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Order Summary ── */}
        <OrderSummary
          ticketPrice={ticket.price}
          qty={quantity}
          isCheckout={step !== "choose"}
          onAction={() => {
            if (step === "choose") setStep("contact");
            else if (step === "contact" && contactValid) setStep("checkout");
            else if (step === "checkout") {
              dispatch(purchaseStart());
              // Here you would typically make an API call
              // For now, we'll simulate success
              setTimeout(() => {
                // dispatch(purchaseSuccess());
                setStep("success");
              }, 2000);
            }
          }}
          actionDisabled={(step === "contact" && !contactValid) || purchaseLoading}
          actionLabel={purchaseLoading ? "Processing..." : step === "checkout" ? "Checkout" : "Continue"}
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