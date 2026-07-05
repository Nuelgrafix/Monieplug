"use client";

import { useRouter } from 'next/navigation'
import { useGetEventsQuery } from '@/redux/slices/apiSlice';

type Event = { id: number; title: string; description?: string; short_description?: string; image?: string; cover_image?: string; date?: string };

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function EventsPage() {
  const router = useRouter();
  const { data: apiEvents = [], isLoading } = useGetEventsQuery(undefined);

  const allEvents = apiEvents.length > 0 ? apiEvents : [];

  const popularEvents = allEvents.filter((e: Event) => e.id <= 4);
  const upcomingEvents = allEvents.filter((e: Event) => e.id > 4);

  return (
    <div className="flex-1 min-h-screen p-6 overflow-y-auto">
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Popular event</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-xl aspect-[4/3] bg-gray-200 mb-2" />
                <div className="h-3.5 w-3/4 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {popularEvents.length > 0 ? (
              popularEvents.map((event: Event) => (
                <PopularEventCard key={event.id} event={event} onClick={() => router.push(`/events/${event.id}`)} />
              ))
            ) : (
              <p className="text-sm text-gray-500 col-span-4">No popular events available.</p>
            )}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-xl aspect-square bg-gray-200 mb-2" />
                <div className="h-3.5 w-3/4 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event: Event) => (
                <UpcomingEventCard key={event.id} event={event} onClick={() => router.push(`/events/${event.id}`)} />
              ))
            ) : (
              <p className="text-sm text-gray-500 col-span-6">No upcoming events available.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function PopularEventCard({ event, onClick }: { event: Event; onClick: () => void }) {
  return (
    <div className="cursor-pointer group" onClick={onClick}>
      <div className="rounded-xl overflow-hidden mb-2 aspect-[4/3] w-full">
        <img
          src={event.image || event.cover_image || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <p className="text-sm font-semibold text-gray-900 leading-tight">{event.title}</p>
      <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{event.description || event.short_description}</p>
      {event.date && <p className="text-xs text-gray-400 mt-1">{formatDate(event.date)}</p>}
    </div>
  );
}

function UpcomingEventCard({ event, onClick }: { event: Event; onClick: () => void }) {
  return (
    <div className="cursor-pointer group" onClick={onClick}>
      <div className="rounded-xl overflow-hidden mb-2 aspect-square bg-gray-100 w-full">
        <img
          src={event.image || event.cover_image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <p className="text-sm font-semibold text-gray-900 leading-tight">{event.title}</p>
      <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{event.description || event.short_description}</p>
      {event.date && <p className="text-xs text-gray-400 mt-1">{formatDate(event.date)}</p>}
    </div>
  );
}