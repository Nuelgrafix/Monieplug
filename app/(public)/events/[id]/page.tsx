"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { useState } from 'react'
import { useGetEventByIdQuery } from '@/redux/slices/apiSlice';
import { PurchaseTicketFlow } from '@/components/PurchaseTicketFlow'

type Ticket = { id: number; name: string; price: string; ticket_image?: string };
type Organizer = { id: number; full_name?: string; email?: string; phone?: string; bank_name?: string; account_number?: string; account_name?: string };
type Event = { id: number; title: string; description?: string; short_description?: string; image?: string; cover_image?: string; date?: string; content?: { type: string; text: string }[]; tickets?: Ticket[]; organizer?: Organizer };

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}


export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { data: event, isLoading } = useGetEventByIdQuery(id) as { data: Event | undefined, isLoading: boolean };

  if (isLoading) {
    return <div className="flex-1 bg-[#F5F5F5] min-h-screen p-6">Loading...</div>;
  }

  if (!event) {
    return <div className="flex-1 bg-[#F5F5F5] min-h-screen p-6">Event not found</div>;
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: event.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };



  if (isPurchasing) {
    return <PurchaseTicketFlow onClose={() => setIsPurchasing(false)} event={event} />;
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
              <span>{formatDate(event.date)}</span>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left – image + actions */}
          <div className="md:w-[340px] flex-shrink-0">
<div className="rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 mb-4">
              <img
                src={event.image || event.cover_image || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPurchasing(true)}
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
          <div className="flex-1 text-sm text-gray-700 leading-relaxed space-y-3">
            {event.content?.map((block, i) => {
              if (block.type === "heading") {
                return (
                  <p key={i} className="font-semibold text-gray-900">
                    {block.text}
                  </p>
                );
              }
              if (block.type === "paragraph") {
                return <p key={i}>{block.text}</p>;
              }

              return null;
            })}
          </div>
        </div>


      </div>
    </div>
  );
}