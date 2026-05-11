"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import React from 'react'
import QRLoadingScreen from '@/components/QRLoadingScreen'
import QRDisplayPage from '@/components/QRDisplayPage'

const page = () => {
  return (
    <div>
      <SetupPaymentQR/>
    </div>
  )
}

export default page




interface Variation {
  id: number;
  name: string;
}

export function SetupPaymentQR() {
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [description, setDescription] = useState("");
  const [qrLabel, setQrLabel] = useState("");
  const [variations, setVariations] = useState<Variation[]>([{ id: Date.now(), name: "" }]);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const addVariation = () =>
    setVariations((v) => [...v, { id: Date.now(), name: "" }]);

  const removeVariation = (id: number) =>
    setVariations((v) => v.filter((x) => x.id !== id));

  const updateVariation = (id: number, name: string) =>
    setVariations((v) => v.map((x) => (x.id === id ? { ...x, name } : x)));

  const canGenerate = businessName.trim() && businessAddress.trim() && qrLabel.trim();

  const handleGenerate = () => {
    if (!canGenerate) return;
    setShowLoadingModal(true);
    // hook up to your QR generation API
    console.log({ businessName, businessAddress, description, qrLabel, variations });
  };

  return (
    <div className="flex-1  min-h-screen p-8 overflow-y-auto">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Set up a payment QR Code</h1>
        <p className="text-sm text-gray-500 mt-1">Recieve payment of your business in one place.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* ── Left column ── */}
        <div className="flex-1 space-y-6 max-w-sm">
          {/* Business name */}
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

          {/* Business address */}
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Description</label>
            <textarea
              placeholder="e.g This payment link is to recieve payment for today's football match, Transport fee e.t.c"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 focus:border-[#1E35C8] transition-all resize-none"
            />
          </div>

          {/* QR Code Label */}
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
            {variations.map((v, i) => (
              <div key={v.id}>
                {/* Badge */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500">This payment has variation</span>
                </div>

                {/* Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Description name  e.g Chelsea match"
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

          {/* Add variation */}
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
          disabled={!canGenerate}
          className={`px-10 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
            canGenerate
              ? "bg-[#1E35C8] text-white hover:bg-[#1a2eb0] active:scale-[0.98] shadow-sm"
              : "bg-[#1E35C8]/40 text-white/70 cursor-not-allowed"
          }`}
        >
          Generate payment QR code
        </button>
      </div>

      {/* Loading Modal */}
      {showLoadingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end pr-8">
          <div className="bg-black/50 backdrop-blur-sm absolute inset-0" onClick={() => setShowLoadingModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-96 h-[500px] overflow-hidden">
            <QRLoadingScreen
              onComplete={() => {
                setShowLoadingModal(false);
                setShowQRModal(true);
              }}
              duration={3000}
            />
          </div>
        </div>
      )}

      {/* QR Display Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end pr-8">
          <div className="bg-black/50 backdrop-blur-sm absolute inset-0" onClick={() => setShowQRModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-96 h-[600px] overflow-hidden">
            <QRDisplayPage
              onEdit={() => setShowQRModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}