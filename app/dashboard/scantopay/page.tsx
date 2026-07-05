"use client";

import { useState, useEffect } from "react";
import { Plus, X, Share2, Pencil } from "lucide-react";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { useCreateQRCodeMutation } from "@/redux/slices/apiSlice";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Variation {
  id: number;
  name: string;
}

interface CreateQRResponse {
  message: string;
  qr_code_url: string;
  vendor_id: string;
}

const BASE_URL = "https://monieplug.onrender.com";

// ─── QR Loading Screen ───────────────────────────────────────────────────────

function QRLoadingScreen({ onComplete, duration = 3000 }: { onComplete?: () => void; duration?: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
      else router.push("/scan2pay/qr");
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 min-h-full bg-white flex flex-col items-center justify-center gap-8 p-6">
      <div className="relative w-20 h-20">
        <svg className="absolute inset-0 animate-spin" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="#E5E7EB" strokeWidth="4" />
          <path d="M40 4 A36 36 0 0 1 76 40" stroke="#1E35C8" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
            <path
              d="M0 22V0L9.5 13.5L14 6L18.5 13.5L28 0V22L23 22V10L18.5 17L14 10L9.5 17V22H0Z"
              fill="#1E35C8"
            />
          </svg>
        </div>
      </div>
      <p className="text-center text-gray-700 text-base leading-relaxed">
        Please hang on while we generate
        <br />
        your <span className="font-semibold text-gray-900">QR code</span>
      </p>
    </div>
  );
}

// ─── QR Display Page ─────────────────────────────────────────────────────────

function QRDisplayPage({
  qrImageUrl,
  onEdit,
}: {
  qrImageUrl: string;
  onEdit?: () => void;
}) {
  const handleDownload = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = "monieplug-qr.png";
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download QR code");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Monieplug Payment QR",
        text: "Scan to make payment",
        url: qrImageUrl,
      });
    } else {
      await navigator.clipboard.writeText(qrImageUrl);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="flex-1 min-h-full bg-[#F5F5F5] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold text-gray-900">Send or Print and share to customers</h1>
          <p className="text-sm text-gray-500 mt-1">Receive payment for your business in one place.</p>
        </div>

        {/* QR Card — shows the actual image returned by the backend */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center mb-5">
          <p className="text-sm text-gray-700 mb-5 font-medium">Scan Me to make payment</p>
          {qrImageUrl && (
            <img
              src={qrImageUrl}
              alt="Payment QR Code"
              className="w-[220px] h-[220px] object-contain"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 py-3 rounded-xl bg-[#1E35C8] text-white text-sm font-semibold hover:bg-[#1a2eb0] active:scale-[0.98] transition-all shadow-sm"
          >
            Download code
          </button>

          <button
            onClick={handleShare}
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Share2 size={16} />
          </button>

          <button
            onClick={onEdit}
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Pencil size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Setup Form ──────────────────────────────────────────────────────────────

function SetupPaymentQR() {
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [description, setDescription] = useState("");
  const [qrLabel, setQrLabel] = useState("");
  const [variations, setVariations] = useState<Variation[]>([{ id: Date.now(), name: "" }]);

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [vendorId, setVendorId] = useState<string | null>(null);

  const router = useRouter();
  const [createQRCode, { isLoading: isCreating }] = useCreateQRCodeMutation();

  const addVariation = () => setVariations((v) => [...v, { id: Date.now(), name: "" }]);
  const removeVariation = (id: number) => setVariations((v) => v.filter((x) => x.id !== id));
  const updateVariation = (id: number, name: string) =>
    setVariations((v) => v.map((x) => (x.id === id ? { ...x, name } : x)));

  const canGenerate = businessName.trim() && businessAddress.trim() && qrLabel.trim();

  useEffect(() => {
    if (vendorId) {
      router.push(`/scantopay/qr?vendor=${vendorId}`);
    }
  }, [vendorId, router]);

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setShowLoadingModal(true);

    try {
      const varNames = variations.map((v) => v.name.trim()).filter(Boolean);

      const payload: Record<string, unknown> = {
        business_name: businessName.trim(),
        business_address: businessAddress.trim(),
        qr_label: qrLabel.trim(),
      };
      if (description.trim()) payload.description = description.trim();
      if (varNames.length > 0) payload.variations = varNames;

      const response = (await createQRCode(payload).unwrap()) as CreateQRResponse;

      if (!response.qr_code_url) {
        throw new Error("No QR code image returned from server");
      }

      const fullImageUrl = `${BASE_URL}${response.qr_code_url}`;
      setQrImageUrl(fullImageUrl);
      if (response.vendor_id) {
        setVendorId(response.vendor_id);
      }
      setShowLoadingModal(false);
      setShowQRModal(true);
    } catch (err: unknown) {
      setShowLoadingModal(false);
      const e = err as { data?: { message?: string }; message?: string };
      toast.error(e?.data?.message || e?.message || "Failed to generate QR code");
    }
  };

  const handleReset = () => {
    setShowQRModal(false);
    setQrImageUrl("");
    setBusinessName("");
    setBusinessAddress("");
    setDescription("");
    setQrLabel("");
    setVariations([{ id: Date.now(), name: "" }]);
  };

  return (
    <div className="flex-1 min-h-screen p-8 overflow-y-auto">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Set up a payment QR Code</h1>
        <p className="text-sm text-gray-500 mt-1">Receive payment for your business in one place.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* ── Left column ── */}
        <div className="flex-1 space-y-6 max-w-sm">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Business name</label>
            <input
              type="text"
              placeholder="e.g SportHub, Gbemga Drive"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 focus:border-[#1E35C8] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Business address</label>
            <input
              type="text"
              placeholder="e.g Road, 14. Udoka Estate, Awka."
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 focus:border-[#1E35C8] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Description</label>
            <textarea
              placeholder="e.g This payment link is to receive payment for today's football match, Transport fee etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 focus:border-[#1E35C8] transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">QR Code Label</label>
            <input
              type="text"
              placeholder="e.g Payment for ViewCenter"
              value={qrLabel}
              onChange={(e) => setQrLabel(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 focus:border-[#1E35C8] transition-all"
            />
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex-1 max-w-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Create payment variations</h2>
          <p className="text-xs text-gray-400 mb-4">E.g Man U match, Chelsea match</p>

          <div className="space-y-3">
            {variations.map((v) => (
              <div key={v.id}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500">This payment has variation</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Description name e.g Chelsea match"
                    value={v.name}
                    onChange={(e) => updateVariation(v.id, e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 focus:border-[#1E35C8] transition-all pr-10"
                  />
                  {variations.length > 1 && (
                    <button
                      onClick={() => removeVariation(v.id)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addVariation}
            className="mt-4 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Generate button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || isCreating}
          className={`px-10 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
            canGenerate && !isCreating
              ? "bg-[#1E35C8] text-white hover:bg-[#1a2eb0] active:scale-[0.98] shadow-sm"
              : "bg-[#1E35C8]/40 text-white/70 cursor-not-allowed"
          }`}
        >
          {isCreating ? "Generating..." : "Generate payment QR code"}
        </button>
      </div>

      {/* Loading Modal */}
      {showLoadingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end pr-8">
          <div className="bg-black/50 backdrop-blur-sm absolute inset-0" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-96 h-[500px] overflow-hidden">
            <QRLoadingScreen duration={3000} />
          </div>
        </div>
      )}

      {/* QR Display Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end pr-8">
          <div
            className="bg-black/50 backdrop-blur-sm absolute inset-0"
            onClick={() => setShowQRModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-96 h-[600px] overflow-hidden">
            <QRDisplayPage
              qrImageUrl={qrImageUrl}
              onEdit={handleReset}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const page = () => <div><SetupPaymentQR /></div>;
export default page;