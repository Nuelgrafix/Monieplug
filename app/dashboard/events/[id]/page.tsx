"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import React, { useState } from 'react'
import { popularEvents, upcomingEvents } from '@/data/events'
import { PurchaseTicketFlow } from '@/components/PurchaseTicketFlow'
import CreateEventModal from '@/components/CreateEventModal'
import CreateEventTickets from '@/components/CreateEventTickets'

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);
  const [purchaseStep, setPurchaseStep] = useState<'none' | 'describe' | 'tickets'>('none');
  const [isPurchasing, setIsPurchasing] = useState(false);

  const allEvents = [...popularEvents, ...upcomingEvents];
  const event = allEvents.find(e => e.id === id);

  if (!event) {
    return <div>Event not found</div>;
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: event.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleNext = (data: { description: string; image: File | null }) => {
    // Handle the next step in purchase flow
    console.log('Next step with data:', data);
    setPurchaseStep('tickets');
  };

  const handleBack = () => {
    setPurchaseStep('describe');
  };

  const handleClose = () => {
    setPurchaseStep('none');
  };

  const handlePublish = (data: { main: any; variations: any[] }) => {
    // Handle the publish logic here
    console.log('Publishing with data:', data);
    // Navigate to purchase ticket flow
    setIsPurchasing(true);
    setPurchaseStep('none');
  };

  if (isPurchasing) {
    return <PurchaseTicketFlow onClose={() => setIsPurchasing(false)} />;
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
              <span>{event.date}</span>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left – image + actions */}
          <div className="md:w-[340px] flex-shrink-0">
            <div className="rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 mb-4">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPurchaseStep('describe')}
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
            {event.content.map((block, i) => {
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

        {/* Purchase Ticket Modals */}
        {purchaseStep === 'describe' && (
          <CreateEventModal
            onClose={handleClose}
            onNext={handleNext}
          />
        )}

        {purchaseStep === 'tickets' && (
          <CreateEventTickets
            onBack={handleBack}
            onClose={handleClose}
            onPublish={handlePublish}
          />
        )}
      </div>
    </div>
  );
}