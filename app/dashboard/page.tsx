"use client";

import { Copy, Eye, Plus, ArrowUpRight, ArrowRight } from "lucide-react";
import React from 'react'
import { useRouter } from 'next/navigation'

const page = () => {
  return (
    <div>
      <HomePage/>
    </div>
  )
}

export default page



const popularEvents = [
  {
    id: 1,
    title: "Live Music Festival",
    description: "Experience the energy of live music with top artists.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80",
  },
  {
    id: 2,
    title: "Contemporary Art Showcase",
    description: "Discover groundbreaking art from emerging and established artists.",
    image: "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400&q=80",
  },
  {
    id: 3,
    title: "Premier League Soccer Match",
    description: "Witness the thrill of a top-tier soccer game live.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80",
  },
  {
    id: 4,
    title: "Premier League Soccer Match",
    description: "Witness the thrill of a top-tier soccer game live.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80",
  },
];

const myEvents = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description: "Innovation and networking in the tech industry.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80",
  },
  {
    id: 2,
    title: "Food & Wine Expo",
    description: "A culinary journey with the finest food and wines.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&q=80",
  },
  {
    id: 3,
    title: "Community Charity Run",
    description: "Support local causes with a fun run for all ages.",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=300&q=80",
  },
  {
    id: 4,
    title: "Indie Film Festival",
    description: "Showcasing independent films from around the globe.",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&q=80",
  },
  {
    id: 5,
    title: "Classical Music Concert",
    description: "An evening of timeless classical music.",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&q=80",
  },
  {
    id: 6,
    title: "Classical Music Concert",
    description: "An evening of timeless classical music.",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&q=80",
  },
];

const historyItems = [
  { date: "2024-03-15", description: "Payment from Sarah", amount: "+$150", positive: true },
  { date: "2024-03-14", description: "Grocery Store", amount: "-$75", positive: false },
  { date: "2024-03-13", description: "Freelance Payment", amount: "+$320", positive: true },
];

export function HomePage() {
  const router = useRouter();

  return (
    <div className="flex-1 bg-[#F5F5F5] min-h-screen p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-5">Welcome to Monieplug</h1>

      {/* Top section: Balance + History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Balance Card */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-[#1E35C8] to-[#3B55E6] p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span>Current Balance</span>
                <Eye size={14} />
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span>9038340539</span>
                <button
                  onClick={() => navigator.clipboard.writeText("9038340539")}
                  className="hover:text-white transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <p className="text-3xl font-bold tracking-tight">₦0.00</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 active:scale-95 transition-all text-sm font-medium text-gray-700 rounded-full px-5 py-2.5 shadow-sm"
            >
              Add Money <Plus size={15} />
            </button>
            <button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 active:scale-95 transition-all text-sm font-medium text-gray-700 rounded-full px-5 py-2.5 shadow-sm" 
              onClick={() => router.push('/dashboard/transfer')}
            >
              Send Money <ArrowUpRight size={15}  />
            </button>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">History</h2>
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
              <ArrowRight size={16} />
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-100">
                <th className="text-left pb-2 font-medium">Date</th>
                <th className="text-left pb-2 font-medium">Description</th>
                <th className="text-left pb-2 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {historyItems.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 text-gray-500">{item.date}</td>
                  <td className="py-3 text-gray-700">{item.description}</td>
                  <td className={`py-3 font-medium ${item.positive ? "text-green-600" : "text-red-500"}`}>
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popular Events */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Popular event</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularEvents.map((event) => (
            <div
              key={event.id}
              className="cursor-pointer group"
            >
              <div className="rounded-xl overflow-hidden mb-2 aspect-[4/3] bg-gray-200">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{event.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{event.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* My Events */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">My events</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {myEvents.map((event) => (
            <div
              key={event.id}
              className="cursor-pointer group flex-shrink-0 w-[148px]"
            >
              <div className="rounded-xl overflow-hidden mb-2 aspect-square bg-gray-200">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{event.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{event.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}