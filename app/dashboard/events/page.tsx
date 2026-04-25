"use client";

import Image from "next/image";
import React from 'react'
import { useRouter } from 'next/navigation'
import { popularEvents, upcomingEvents } from '@/data/events'

const page = () => {
  return (
    <div><EventsPage/></div>
  )
}

export default page

function PopularEventCard({
  title,
  description,
  image,
  onClick,
}: {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
}) {
  return (
    <div className="cursor-pointer group" onClick={onClick}>
      <div className="rounded-xl overflow-hidden mb-2 aspect-[4/3] w-full">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <p className="text-sm font-semibold text-gray-900 leading-tight">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{description}</p>
    </div>
  );
}

function UpcomingEventCard({
  title,
  description,
  image,
  onClick,
}: {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
}) {
  return (
    <div className="cursor-pointer group" onClick={onClick}>
      <div className="rounded-xl overflow-hidden mb-2 aspect-square bg-gray-100 w-full">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <p className="text-sm font-semibold text-gray-900 leading-tight">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{description}</p>
    </div>
  );
}

export function EventsPage() {
  const router = useRouter();

  return (
    <div className="flex-1 min-h-screen p-6 overflow-y-auto">
      {/* Popular Events */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Popular event</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularEvents.map((event) => (
            <PopularEventCard key={event.id} {...event} onClick={() => router.push(`/dashboard/events/${event.id}`)} />
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {upcomingEvents.map((event) => (
            <UpcomingEventCard key={event.id} {...event} onClick={() => router.push(`/dashboard/events/${event.id}`)} />
          ))}
        </div>
      </section>
    </div>
  );
}