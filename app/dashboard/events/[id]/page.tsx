"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Calendar, Share2, MapPin } from "lucide-react";
import React, { useState } from "react";
import { useGetEventByIdQuery } from "@/redux/slices/apiSlice";
import { PurchaseTicketFlow } from "@/components/PurchaseTicketFlow";

interface ApiTicket {
  id: number;
  name: string;
  price: string;
  ticket_image: string;
}

interface ApiEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  tickets: ApiTicket[];
  organizer?: {
    bank_name?: string;
    account_number?: string;
    account_name?: string;
  };
}

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id as string);

  const [showPurchase, setShowPurchase] = useState(false);

  const {
    data: event,
    isLoading,
    isError,
  } = useGetEventByIdQuery(id, { skip: !id || isNaN(id) });

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: event?.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-[#F5F5F5] min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading event...</div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="flex-1 bg-[#F5F5F5] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Event not found or failed to load.</p>
          <button onClick={() => router.back()} className="text-[#1E35C8] text-sm underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Purchase ticket flow
  if (showPurchase) {
    return (
      <PurchaseTicketFlow
        onClose={() => setShowPurchase(false)}
        event={{
          id: event.id,
          title: event.title,
          organizer: event.organizer,
          tickets: event.tickets,
        }}
      />
    );
  }

  return (
    <div className="flex-1 bg-[#F5F5F5] min-h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white min-h-screen p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="mt-0.5 text-gray-700 hover:text-gray-900 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">{event.title}</h1>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>
                {new Date(event.date).toLocaleDateString("en-NG", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                <MapPin size={12} />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left – image + actions */}
          <div className="md:w-[340px] flex-shrink-0">
            <div className="rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 mb-4">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPurchase(true)}
                className="flex-1 bg-[#1E35C8] hover:bg-[#1a2eb0] active:scale-[0.98] text-white text-sm font-semibold py-3 rounded-xl transition-all shadow-sm"
              >
                Purchase ticket
              </button>
              <button
                onClick={handleShare}
                className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Right – description */}
          <div className="flex-1 text-sm text-gray-700 leading-relaxed">
            <p>{event.description || "No description available."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
