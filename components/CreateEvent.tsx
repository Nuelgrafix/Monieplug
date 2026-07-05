"use client";

import { useState, useRef, useCallback } from "react";
import {
  CalendarDays,
  MapPin,
  Type,
  AlignLeft,
  ImagePlus,
  X,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Ticket,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCreateEventMutation } from "@/redux/slices/apiSlice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormErrors {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  image?: string;
}

interface TicketVariation {
  id: number;
  name: string;
  fee: string;
  image: File | string;
}

interface MainTicket {
  name: string;
  fee: string;
  image: File | string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISODateTime(dateStr: string, timeStr: string): string {
  if (!dateStr || !timeStr) return "";
  return `${dateStr}T${timeStr}:00`;
}

function validate(
  title: string,
  description: string,
  date: string,
  time: string,
  location: string
): FormErrors {
  const errors: FormErrors = {};
  if (!title.trim()) errors.title = "Title is required";
  else if (title.trim().length < 3) errors.title = "Title must be at least 3 characters";

  if (!description.trim()) errors.description = "Description is required";
  else if (description.trim().length < 10) errors.description = "Description must be at least 10 characters";

  if (!date) errors.date = "Date is required";
  if (!time) errors.date = (errors.date ? errors.date + " & " : "") + "Time is required";
  if (date && time && new Date(`${date}T${time}`) < new Date()) {
    errors.date = "Event must be in the future";
  }

  if (!location.trim()) errors.location = "Location is required";

  return errors;
}

// ─── Field Components ─────────────────────────────────────────────────────────

function FieldWrapper({
  label,
  required,
  error,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-1">
          {label}
          {required && <span className="text-[#1E35C8] text-sm leading-none">*</span>}
        </label>
        {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-800 placeholder-gray-300 " +
  "focus:outline-none focus:border-[#1E35C8] focus:ring-2 focus:ring-[#1E35C8]/15 transition-all duration-200 " +
  "hover:border-gray-300";

// ─── Image Preview ─────────────────────────────────────────────────────────────

function ImagePreview({ preview, onClear }: { preview: string | null; onClear: () => void }) {
  const [valid, setValid] = useState(true);

  if (!preview || !valid) return null;

  return (
    <div className="relative mt-3 rounded-xl overflow-hidden aspect-[16/7] bg-gray-100 group">
      <img
        src={preview}
        alt="Event preview"
        className="w-full h-full object-cover"
        onError={() => setValid(false)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <button
        type="button"
        onClick={onClear}
        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
      >
        <X size={12} />
      </button>
      <div className="absolute bottom-2 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-white/80 font-medium">Event cover preview</span>
      </div>
    </div>
  );
}

// ─── Ticket Form ──────────────────────────────────────────────────────────────

function TicketForm({
  values,
  onChange,
}: {
  values: { name: string; fee: string; image: File | string };
  onChange: (field: string, value: File | string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Name e.g Regular, VIP, Early Bird"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/25 focus:border-[#1E35C8] transition-all"
        />
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white w-36">
          <Ticket size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Price"
            value={values.fee}
            onChange={(e) => onChange("fee", e.target.value)}
            className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Image Upload Field */}
      <div>
        <div className="text-xs text-gray-500 mb-1.5">Ticket Image (optional)</div>
        <label className="flex items-center gap-2 cursor-pointer border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white transition-all">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onChange("image", file);
              }
            }}
          />
          <span className="text-[#1E35C8] font-medium">Choose image</span>
          <span className="text-gray-400">or drop file here</span>
        </label>

        {values.image && typeof values.image !== "string" && (
          <div className="mt-2 flex items-center gap-3 text-sm">
            <img
              src={URL.createObjectURL(values.image)}
              alt="preview"
              className="w-12 h-12 rounded-lg object-cover border"
            />
            <div className="flex-1 min-w-0">
              <div className="truncate text-gray-700">{values.image.name}</div>
              <button
                type="button"
                onClick={() => onChange("image", "")}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        )}
        {values.image && typeof values.image === "string" && values.image && (
          <div className="mt-2 flex items-center gap-3 text-sm">
            <img
              src={values.image}
              alt="preview"
              className="w-12 h-12 rounded-lg object-cover border"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="flex-1 min-w-0">
              <div className="truncate text-gray-700">{values.image}</div>
              <button
                type="button"
                onClick={() => onChange("image", "")}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Success State ─────────────────────────────────────────────────────────────

function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-3xl bg-[#1E35C8] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#1E35C8]/30">
          <CheckCircle2 size={36} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Created!</h2>
        <p className="text-sm text-gray-500 mb-8">
          Your event has been published and tickets are now live for attendees to purchase.
        </p>
        <button
          onClick={onReset}
          className="px-8 py-3 rounded-xl bg-[#1E35C8] text-white text-sm font-semibold hover:bg-[#1a2eb0] active:scale-[0.98] transition-all shadow-sm"
        >
          Create Another Event
        </button>
      </div>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "w-5 h-2 bg-[#1E35C8]"
              : i < current
              ? "w-2 h-2 bg-[#1E35C8]/40"
              : "w-2 h-2 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function CreateEventPage() {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Ticket state
  const [mainTicket, setMainTicket] = useState<MainTicket>({ name: "", fee: "", image: "" });
  const [ticketVariations, setTicketVariations] = useState<TicketVariation[]>([
    { id: Date.now(), name: "", fee: "", image: "" },
  ]);

  // UI state
  const [step, setStep] = useState(0); // 0 = details, 1 = datetime & location, 2 = media, 3 = tickets
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();

  const STEPS = ["Details", "When & Where", "Media", "Tickets"];

  const markTouched = (field: string) =>
    setTouched((p) => ({ ...p, [field]: true }));

  // Validate current step fields only
  const stepValid = useCallback(() => {
    if (step === 0) return title.trim().length >= 3 && description.trim().length >= 10;
    if (step === 1) {
      const futureOk = date && time ? new Date(`${date}T${time}`) > new Date() : false;
      return date && time && location.trim() && futureOk;
    }
    if (step === 2) return true; // image file optional
    if (step === 3) {
      // At least the main ticket name and fee should be filled
      return mainTicket.name.trim().length > 0 && mainTicket.fee.trim().length > 0;
    }
    return true;
  }, [step, title, description, date, time, location, mainTicket]);

  const handleNext = () => {
    if (!stepValid()) {
      if (step === 0 || step === 1) {
        const all = validate(title, description, date, time, location);
        setErrors(all);
        setTouched({ title: true, description: true, date: true, location: true, image: true });
      }
      if (step === 3) {
        toast.error("Please fill in at least the ticket name and price");
      }
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleImageSelect = (file: File | null) => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Ticket handlers
  const updateMainTicket = (field: string, value: File | string) =>
    setMainTicket((m) => ({ ...m, [field]: value }));

  const updateVariation = (id: number, field: string, value: File | string) =>
    setTicketVariations((v) => v.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  const addVariation = () =>
    setTicketVariations((v) => [...v, { id: Date.now(), name: "", fee: "", image: "" }]);

  const removeVariation = (id: number) =>
    setTicketVariations((v) => v.filter((x) => x.id !== id));

  const handleSubmit = async () => {
    const allErrors = validate(title, description, date, time, location);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setTouched({ title: true, description: true, date: true, location: true, image: true });
      toast.error("Please fix the errors before submitting");
      return;
    }

    if (!mainTicket.name.trim() || !mainTicket.fee.trim()) {
      toast.error("Please fill in at least the ticket name and price");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("date", toISODateTime(date, time));
      formData.append("location", location.trim());

      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Build tickets array
      const ticketsArray: { name: string; price: number }[] = [];

      // Add main ticket
      ticketsArray.push({
        name: mainTicket.name.trim(),
        price: parseFloat(mainTicket.fee.trim()) || 0,
      });

      // Add variations
      for (const variation of ticketVariations) {
        if (!variation.name.trim()) continue;
        ticketsArray.push({
          name: variation.name.trim(),
          price: parseFloat(variation.fee.trim()) || 0,
        });
      }

      formData.append("tickets", JSON.stringify(ticketsArray));

      // Append ticket images with indexed keys
      if (mainTicket.image && typeof mainTicket.image !== "string") {
        formData.append("tickets[0][ticket_image]", mainTicket.image);
      }

      ticketVariations.forEach((variation, index) => {
        if (variation.image && typeof variation.image !== "string") {
          formData.append(`tickets[${index + 1}][ticket_image]`, variation.image);
        }
      });

      await createEvent(formData).unwrap();

      setSuccess(true);
      toast.success("Event and tickets created successfully!");
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string };
      toast.error(e?.data?.message || e?.message || "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle(""); setDescription(""); setDate("");
    setTime(""); setLocation("");
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null); setImagePreview(null);
    setMainTicket({ name: "", fee: "", image: "" });
    setTicketVariations([{ id: Date.now(), name: "", fee: "", image: "" }]);
    setErrors({}); setTouched({}); setStep(0); setSuccess(false);
  };

  if (success) return <SuccessScreen onReset={handleReset} />;

  // Character counters
  const descLen = description.length;
  const titleLen = title.length;

  return (
    <div className="flex-1 min-h-screen bg-gray-50 overflow-y-auto">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-white/90">
        <div>
          <h1 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Sparkles size={16} className="text-[#1E35C8]" />
            Create Event
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
        </div>
        <StepDots current={step} total={STEPS.length} />
      </div>

      {/* ── Form body ── */}
      <div className="max-w-xl mx-auto px-5 py-8">

        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-100 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-[#1E35C8] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* ── STEP 0: Details ── */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Event Details</h2>
              <p className="text-sm text-gray-400 mt-1">Start with the basics — what's your event about?</p>
            </div>

            <FieldWrapper
              label="Title"
              required
              error={touched.title ? errors.title : undefined}
              hint={`${titleLen}/100`}
            >
              <div className="relative">
                <Type size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input
                  type="text"
                  maxLength={100}
                  placeholder="e.g. Summer Festival Lagos 2025"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => markTouched("title")}
                  className={`${inputBase} pl-10 ${touched.title && errors.title ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
                />
              </div>
            </FieldWrapper>

            <FieldWrapper
              label="Description"
              required
              error={touched.description ? errors.description : undefined}
              hint={`${descLen}/1000`}
            >
              <textarea
                rows={6}
                maxLength={1000}
                placeholder="Describe your event — what to expect, who it's for, what to bring..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => markTouched("description")}
                className={`${inputBase} resize-none leading-relaxed ${touched.description && errors.description ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
              />
            </FieldWrapper>
          </div>
        )}

        {/* ── STEP 1: When & Where ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">When & Where</h2>
              <p className="text-sm text-gray-400 mt-1">Set the date, time, and location of your event.</p>
            </div>

            <FieldWrapper
              label="Date & Time"
              required
              error={touched.date ? errors.date : undefined}
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <CalendarDays size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                    onBlur={() => markTouched("date")}
                    className={`${inputBase} pl-10 ${touched.date && errors.date ? "border-red-300" : ""}`}
                  />
                </div>
                <div className="relative">
                  <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    onBlur={() => markTouched("date")}
                    className={`${inputBase} pl-10 ${touched.date && errors.date ? "border-red-300" : ""}`}
                  />
                </div>
              </div>

              {date && time && !errors.date && (
                <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E35C8]/8 text-[#1E35C8] text-xs font-medium">
                  <CalendarDays size={11} />
                  {new Date(`${date}T${time}`).toLocaleDateString("en-NG", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </FieldWrapper>

            <FieldWrapper
              label="Location"
              required
              error={touched.location ? errors.location : undefined}
            >
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Eko Hotel, Victoria Island, Lagos"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onBlur={() => markTouched("location")}
                  className={`${inputBase} pl-10 ${touched.location && errors.location ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
                />
              </div>
            </FieldWrapper>
          </div>
        )}

        {/* ── STEP 2: Media ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Event Cover</h2>
              <p className="text-sm text-gray-400 mt-1">
                Upload a cover image for your event. This will be shown in listings and tickets. Optional but recommended.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                Cover Image <span className="text-gray-400 font-normal normal-case">(optional)</span>
              </label>

              <div
                onClick={() => document.getElementById("event-image-input")?.click()}
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    handleImageSelect(file);
                  }
                }}
                className="cursor-pointer border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100/70 hover:border-gray-300 transition-all active:scale-[0.995]"
              >
                <input
                  id="event-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleImageSelect(file);
                    e.currentTarget.value = "";
                  }}
                />

                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                  <ImagePlus size={22} className="text-[#1E35C8]" />
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-400 mt-0.5">PNG, JPG or WEBP up to 5MB</p>
                </div>

                {imageFile && (
                  <div className="mt-1 text-[11px] text-emerald-600 font-medium">
                    Selected: {imageFile.name}
                  </div>
                )}
              </div>

              <ImagePreview preview={imagePreview} onClear={() => handleImageSelect(null)} />

              {!imagePreview && (
                <div className="mt-3 rounded-xl border border-gray-100 bg-white p-4 text-center text-xs text-gray-400">
                  No image selected yet — your event will use a default placeholder.
                </div>
              )}
            </div>

            {/* Summary card */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Event Summary</p>
              <div className="flex gap-3">
                <Type size={14} className="text-[#1E35C8] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Title</p>
                  <p className="text-sm font-semibold text-gray-800">{title}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CalendarDays size={14} className="text-[#1E35C8] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Date</p>
                  <p className="text-sm font-medium text-gray-700">
                    {date && time
                      ? new Date(`${date}T${time}`).toLocaleString("en-NG", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin size={14} className="text-[#1E35C8] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Location</p>
                  <p className="text-sm font-medium text-gray-700">{location}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <AlignLeft size={14} className="text-[#1E35C8] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Description</p>
                  <p className="text-sm font-medium text-gray-700 line-clamp-2">{description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Tickets ── */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create Tickets</h2>
              <p className="text-sm text-gray-400 mt-1">
                Set up ticket types and pricing for your event. At least one ticket is required.
              </p>
            </div>

            {/* Main Ticket */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#1E35C8]/10 flex items-center justify-center">
                  <Ticket size={16} className="text-[#1E35C8]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Main Ticket</h3>
                  <p className="text-xs text-gray-400">Required — the primary ticket for your event</p>
                </div>
              </div>
              <TicketForm values={mainTicket} onChange={updateMainTicket} />
            </div>

            {/* Ticket Variations */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Plus size={16} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Ticket Variations</h3>
                    <p className="text-xs text-gray-400">Optional — add different ticket tiers</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {ticketVariations.map((v, i) => (
                  <div key={v.id} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500">Variation {i + 1}</span>
                      </div>
                      {ticketVariations.length > 1 && (
                        <button
                          onClick={() => removeVariation(v.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <TicketForm
                      values={v}
                      onChange={(field, value) => updateVariation(v.id, field, value)}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={addVariation}
                className="mt-4 flex items-center gap-2 text-sm text-[#1E35C8] font-medium hover:text-[#1a2eb0] transition-colors"
              >
                <Plus size={16} />
                Add variation
              </button>
            </div>

            {/* Ticket summary */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Ticket Summary</p>
              {mainTicket.name && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket size={14} className="text-[#1E35C8]" />
                    <span className="text-sm font-medium text-gray-800">{mainTicket.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">₦{mainTicket.fee || "0"}</span>
                </div>
              )}
              {ticketVariations.filter(v => v.name).map((v, i) => (
                <div key={v.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800">{v.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">₦{v.fee || "0"}</span>
                </div>
              ))}
              {!mainTicket.name && ticketVariations.filter(v => v.name).length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">No tickets configured yet</p>
              )}
            </div>
          </div>
        )}

        {/* ── Navigation buttons ── */}
        <div className={`flex mt-10 gap-3 ${step > 0 ? "justify-between" : "justify-end"}`}>
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98] shadow-sm ${
                stepValid()
                  ? "bg-[#1E35C8] text-white hover:bg-[#1a2eb0]"
                  : "bg-[#1E35C8]/40 text-white/70 cursor-not-allowed"
              }`}
            >
              Continue
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || isCreating}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98] shadow-sm ${
                !(submitting || isCreating)
                  ? "bg-[#1E35C8] text-white hover:bg-[#1a2eb0]"
                  : "bg-[#1E35C8]/60 text-white/80 cursor-not-allowed"
              }`}
            >
              {(submitting || isCreating) ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Publish Event
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
