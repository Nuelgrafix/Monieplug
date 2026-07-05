"use client";

import React from 'react'
import { useRouter } from 'next/navigation'
import { useGetEventsQuery } from '@/redux/slices/apiSlice'

// Matches the actual API response shape
interface Ticket {
  id: number;
  name: string;
  price: string;
  ticket_image: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  tickets: Ticket[];
}

const page = () => {
  return (
    <div><EventsPage /></div>
  )
}

export default page

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function PopularEventCard({
  title,
  description,
  image,
  date,
  location,
  onClick,
}: {
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
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
      <p className="text-xs text-gray-500 mt-0.5">{location} · {formatDate(date)}</p>
      <p className="text-xs text-gray-400 mt-0.5 leading-snug line-clamp-2">{description}</p>
    </div>
  );
}

function UpcomingEventCard({
  title,
  description,
  image,
  date,
  location,
  onClick,
}: {
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
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
      <p className="text-xs text-gray-500 mt-0.5">{location} · {formatDate(date)}</p>
      <p className="text-xs text-gray-400 mt-0.5 leading-snug line-clamp-2">{description}</p>
    </div>
  );
}

function EventsPage() {
  const router = useRouter();

  const { data: eventsData, isLoading, error } = useGetEventsQuery(undefined);

  const allEvents: Event[] = eventsData ?? [];

  const popularEvents = allEvents.slice(0, 4);
  const upcomingEvents = allEvents.slice(4);

  if (isLoading) {
    return (
      <div className="flex-1 min-h-screen p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 min-h-screen p-6 flex items-center justify-center">
        <div className="text-red-500">Failed to load events. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen p-6 overflow-y-auto">
      {/* Popular Events */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Popular Events</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularEvents.length > 0 ? (
            popularEvents.map((event) => (
              <PopularEventCard
                key={event.id}
                title={event.title}
                description={event.description}
                image={event.image}
                date={event.date}
                location={event.location}
                onClick={() => router.push(`/dashboard/events/${event.id}`)}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500 col-span-4">No popular events available.</p>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <UpcomingEventCard
                key={event.id}
                title={event.title}
                description={event.description}
                image={event.image}
                date={event.date}
                location={event.location}
                onClick={() => router.push(`/dashboard/events/${event.id}`)}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500 col-span-full">No upcoming events available.</p>
          )}
        </div>
      </section>
    </div>
  );
}