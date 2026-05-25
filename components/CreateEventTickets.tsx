"use client";

import { useState } from "react";
import { ArrowLeft, X, Ticket, CalendarDays, Plus, Trash2 } from "lucide-react";

interface TicketVariation {
  id: number;
  name: string;
  fee: string;
  image: File | string;   // support file upload or URL
  date: string;
}

interface MainTicket {
  name: string;
  fee: string;
  image: File | string;
  date: string;
}

interface CreateEventTicketsProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: { main: MainTicket; variations: TicketVariation[] }) => void;
}

function TicketForm({
  values,
  onChange,
}: {
  values: { name: string; fee: string; image: File | string; date: string };
  onChange: (field: string, value: File | string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Name  e.g Regular"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/25 focus:border-[#1E35C8] transition-all"
        />
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white w-36">
          <Ticket size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Ticket fee"
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

        {values.image && (
          <div className="mt-2 flex items-center gap-3 text-sm">
            {typeof values.image !== "string" ? (
              <img
                src={URL.createObjectURL(values.image)}
                alt="preview"
                className="w-12 h-12 rounded-lg object-cover border"
              />
            ) : values.image ? (
              <img
                src={values.image}
                alt="preview"
                className="w-12 h-12 rounded-lg object-cover border"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : null}

            <div className="flex-1 min-w-0">
              <div className="truncate text-gray-700">
                {typeof values.image === "string" ? values.image : values.image.name}
              </div>
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

      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white">
        <CalendarDays size={14} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="MM/DD/YY"
          value={values.date}
          onChange={(e) => onChange("date", e.target.value)}
          className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
        />
      </div>
    </div>
  );
}

export default function CreateEventTickets({
  onBack,
  onClose,
  onPublish,
}: CreateEventTicketsProps) {
  const [main, setMain] = useState<MainTicket>({ name: "", fee: "", image: "", date: "" });
  const [variations, setVariations] = useState<TicketVariation[]>([
    { id: Date.now(), name: "", fee: "", image: "", date: "" },
  ]);

  const updateMain = (field: string, value: File | string) =>
    setMain((m) => ({ ...m, [field]: value }));

  const updateVariation = (id: number, field: string, value: File | string) =>
    setVariations((v) => v.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  const addVariation = () =>
    setVariations((v) => [...v, { id: Date.now(), name: "", fee: "", image: "", date: "" }]);

  const removeVariation = (id: number) =>
    setVariations((v) => v.filter((x) => x.id !== id));

  const handlePublish = () => onPublish({ main, variations });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col sm:flex-row gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {/* Left – Main ticket */}
          <div className="flex-1 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Enter event ticket price and Date
            </h2>
            <TicketForm values={main} onChange={updateMain} />
          </div>

          {/* Right – Variations */}
          <div className="flex-1 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Ticket variation</h2>

            <div className="space-y-5">
              {variations.map((v, i) => (
                <div key={v.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                      <span className="text-xs text-gray-500">This ticket has variation</span>
                    </div>
                    {variations.length > 1 && (
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

            {/* Add variation */}
            <button
              onClick={addVariation}
              className="mt-4 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100">
          <button
            onClick={handlePublish}
            className="px-8 py-3 rounded-xl bg-[#1E35C8] text-white text-sm font-semibold hover:bg-[#1a2eb0] active:scale-[0.98] transition-all shadow-sm"
          >
            Publish event
          </button>
        </div>
      </div>
    </div>
  );
}