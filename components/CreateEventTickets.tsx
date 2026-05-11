"use client";

import { useState } from "react";
import { ArrowLeft, X, Ticket, CalendarDays, Plus, Trash2 } from "lucide-react";

interface TicketVariation {
  id: number;
  name: string;
  fee: string;
  image: string;
  date: string;
}

interface MainTicket {
  name: string;
  fee: string;
  image: string;
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
  values: { name: string; fee: string; image: string; date: string };
  onChange: (field: string, value: string) => void;
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

      <input
        type="text"
        placeholder="Add ticket image"
        value={values.image}
        onChange={(e) => onChange("image", e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/25 focus:border-[#1E35C8] transition-all"
      />

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

  const updateMain = (field: string, value: string) =>
    setMain((m) => ({ ...m, [field]: value }));

  const updateVariation = (id: number, field: string, value: string) =>
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