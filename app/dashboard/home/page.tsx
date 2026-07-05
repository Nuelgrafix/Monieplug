"use client";

import { Copy, Eye, Plus, ArrowUpRight, ArrowRight } from "lucide-react";
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';
import { 
  useGetBalanceMutation, 
  useGetEventsQuery, 
  useGetUserTicketsQuery,
  useTransferFundsMutation 
} from '@/redux/slices/apiSlice';
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

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

export default function HomePage() {
  const router = useRouter();

  // Get current user from Redux auth state
  const currentUser: any = useSelector((state: RootState) => state.auth.user);
  const [showBalance, setShowBalance] = useState(false);

  const [getBalance, { data: balanceDataRaw, isLoading: balanceLoading }] = useGetBalanceMutation();
  const balanceData: any = balanceDataRaw;

 const [transferFunds, { isLoading: transferLoading }] = useTransferFundsMutation();

  const { data: eventsData = [], isLoading: eventsLoading } = useGetEventsQuery(undefined);
  const events: any[] = eventsData as any[];

  const { data: userTicketsData = [], isLoading: ticketsLoading } = useGetUserTicketsQuery(undefined);
  const userTickets: any[] = userTicketsData as any[];

  // Send Money modal state
  const [sendOpen, setSendOpen] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendDesc, setSendDesc] = useState("");
  // Derived data
  const accountNumber = currentUser?.account_number || currentUser?.phone || "N/A";

  // Fetch balance on mount - send { accountNo: "..." } as required by the backend
  useEffect(() => {
    if (accountNumber && accountNumber !== "N/A") {
      getBalance({ accountNo: accountNumber }).catch(() => {
        // silent fail, balance will stay at 0
      });
    }
  }, [getBalance, accountNumber]);
  const balance = balanceData?.account?.availableBalance ?? 0;
  const formattedBalance = `₦${Number(balance).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

  const popularEvents = events.slice(0, 4);

  // "My events" — prefer tickets, fallback to empty
  const myEvents = (userTickets || []).slice(0, 6).map((ticket: any, index: number) => ({
    id: ticket.id || ticket.event?.id || index,
    title: ticket.event?.title || ticket.event_name || ticket.title || "My Ticket",
    description: ticket.event?.description || ticket.description || "Ticket purchased",
    image: ticket.event?.image || ticket.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80",
  }));

  const isLoading = balanceLoading || eventsLoading || ticketsLoading;

  // Send Money handler
  const [transferError, setTransferError] = useState<string | null>(null);
  const handleSendMoney = async () => {
    if (!recipientPhone || !sendAmount) return;
    setTransferError(null);
    try {
      const payload: any = {
        phone: recipientPhone.trim(),
        amount: Number(sendAmount),
      };
      if (sendDesc.trim()) payload.description = sendDesc.trim();

      await transferFunds(payload).unwrap();
      toast.success("Transfer successful!");
      setSendOpen(false);
      setRecipientPhone("");
      setSendAmount("");
      setSendDesc("");
      // refresh balance
      if (accountNumber && accountNumber !== "N/A") {
        getBalance({ accountNo: accountNumber });
      }
    } catch (err: any) {
      setTransferError(err?.data?.message || "Transfer failed. Please try again.");
    }
  };

  return (
    <div className="flex-1 bg-[#F5F5F5] min-h-screen p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-5">
        Welcome {" "}<span className="text-[#1E35C8]">{currentUser?.first_name ? `, ${currentUser.first_name}` : currentUser?.email}</span> to Monieplug
      </h1>

      {/* Top section: Balance + History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Balance Card */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-[#1E35C8] to-[#3B55E6] p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span>Current Balance</span>
                <button
                  onClick={() => setShowBalance((prev) => !prev)}
                  className="hover:text-white transition-colors"
                  aria-label={showBalance ? "Hide balance" : "Show balance"}
                >
                  {showBalance ? <Eye size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span>{accountNumber}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(String(accountNumber));
                    toast.success("Account number copied!");
                  }}
                  className="hover:text-white transition-colors"
                  aria-label="Copy account number"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <p className="text-3xl font-bold tracking-tight">
              {balanceLoading ? "..." : showBalance ? formattedBalance : "₦******"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* <button
              className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 active:scale-95 transition-all text-sm font-medium text-gray-700 rounded-full px-5 py-2.5 shadow-sm"
              onClick={() => router.push('/dashboard/fund-wallet')} // adjust route if exists
            >
              Add Money <Plus size={15} />
            </button> */}
            <button 
              className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 active:scale-95 transition-all text-sm font-medium text-gray-700 rounded-full px-5 py-2.5 shadow-sm" 
              onClick={() => router.push('/dashboard/transfer')}
            >
              Send Money <ArrowUpRight size={15} />
            </button>

            {/* Send Money quick modal */}
            {sendOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 mx-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Send Money</h2>
                  <p className="text-sm text-gray-500 mb-5">Transfer funds instantly.</p>

                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Recipient Phone</label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="0805 422 7643"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E35C8] focus:border-[#1E35C8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Amount (₦)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0.00"
                        value={sendAmount ? `₦${Number(sendAmount).toLocaleString()}` : ""}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, "");
                          setSendAmount(raw);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E35C8] focus:border-[#1E35C8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description (optional)</label>
                      <input
                        type="text"
                        placeholder="What's this for?"
                        value={sendDesc}
                        onChange={(e) => setSendDesc(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E35C8] focus:border-[#1E35C8]"
                      />
                    </div>
                  </div>

                  {transferError && (
                    <p className="text-sm text-red-500 mb-3">{transferError}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSendOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendMoney}
                      disabled={transferLoading || !recipientPhone || !sendAmount}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        transferLoading || !recipientPhone || !sendAmount
                          ? "bg-[#1E35C8]/40 text-white/70 cursor-not-allowed"
                          : "bg-[#1E35C8] text-white hover:bg-[#1a2eb0] active:scale-[0.98]"
                      }`}
                    >
                      {transferLoading ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History (still static until transaction history endpoint is added) */}
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
          {historyItems.length === 0 && (
            <p className="text-sm text-gray-500 py-4 text-center">No recent transactions</p>
          )}
        </div>
      </div>

      {/* Popular Events */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Popular event</h2>
        {eventsLoading ? (
          <div className="text-sm text-gray-500">Loading events...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularEvents.length > 0 ? (
              popularEvents.map((event: any, idx: number) => (
                <div
                  key={event.id ?? idx}
                  className="cursor-pointer group"
                  onClick={() => router.push(`/dashboard/events/${event.id}`)}
                >
                  <div className="rounded-xl overflow-hidden mb-2 aspect-[4/3] bg-gray-200">
                    <img
                      src={event.image || event.cover_image || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{event.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">
                    {event.description || event.short_description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 col-span-4">No popular events available.</p>
            )}
          </div>
        )}
      </section>

      {/* My Events (from user tickets) */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">My events</h2>
        {ticketsLoading ? (
          <div className="text-sm text-gray-500">Loading your events...</div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {myEvents.length > 0 ? (
              myEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="cursor-pointer group flex-shrink-0 w-[148px]"
                  onClick={() => router.push(`/dashboard/events/${event.id}`)}
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
              ))
            ) : (
              <p className="text-sm text-gray-500">You have no tickets yet. Browse events to get started!</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
