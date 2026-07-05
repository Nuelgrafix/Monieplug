"use client";

import { Copy, Eye, ArrowUpRight, ArrowRight } from "lucide-react";
import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';
import {
  useGetBalanceMutation,
  useGetEventsQuery,
  useTransferFundsMutation,
  useGetTransactionHistoryMutation,
} from '@/redux/slices/apiSlice';
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import WelcomeGreeting from "@/components/Greetings";

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function BalanceSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-[#1E35C8] to-[#3B55E6] p-5 shadow-lg h-[100px] animate-pulse" />
      <div className="flex gap-3">
        <div className="h-10 w-32 rounded-full bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 flex-1 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <div>
      <div className="rounded-xl aspect-[4/3] bg-gray-200 animate-pulse mb-2" />
      <div className="h-3.5 w-3/4 bg-gray-200 rounded animate-pulse mb-1" />
      <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const currentUser: any = useSelector((state: RootState) => state.auth.user);
  const [showBalance, setShowBalance] = useState(false);

  const [getBalance, { data: balanceDataRaw, isLoading: balanceLoading }] = useGetBalanceMutation();
  const [getTransactionHistory, { data: txnDataRaw, isLoading: txnLoading }] = useGetTransactionHistoryMutation();
  const txnData: any = txnDataRaw;

  const [transferFunds, { isLoading: transferLoading }] = useTransferFundsMutation();

  const { data: eventsData = [], isLoading: eventsLoading } = useGetEventsQuery(undefined);
  const events: any[] = eventsData as any[];

  const [sendOpen, setSendOpen] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendDesc, setSendDesc] = useState("");
  const [transferError, setTransferError] = useState<string | null>(null);

  const accountNumber = currentUser?.account_number || currentUser?.phone || "N/A";

  useEffect(() => {
    if (!mounted) return;
    if (accountNumber && accountNumber !== "N/A") {
      getBalance({ accountNo: accountNumber }).catch(() => {});
    }
  }, [mounted, accountNumber]);

  useEffect(() => {
    if (!mounted) return;
    if (accountNumber && accountNumber !== "N/A") {
      const toDate = formatDateToYYYYMMDD(new Date());
      const fromDate = formatDateToYYYYMMDD(addDays(new Date(), -30));
      getTransactionHistory({
        accountNumber,
        fromDate,
        toDate,
        numberOfItems: "10",
      }).catch(() => {});
    }
  }, [mounted, accountNumber]);

  const balance = balanceDataRaw?.account?.availableBalance ?? 0;
  const formattedBalance = `₦${Number(balance).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

  const historyItems = useMemo(() => {
    if (!txnData) return [];
    let rawTxns: any[] = [];
    if (Array.isArray(txnData)) {
      rawTxns = txnData;
    } else if (Array.isArray(txnData.transactions)) {
      rawTxns = txnData.transactions;
    } else if (Array.isArray(txnData.data)) {
      rawTxns = txnData.data;
    } else if (Array.isArray(txnData.results)) {
      rawTxns = txnData.results;
    } else if (typeof txnData === 'object' && txnData !== null) {
      rawTxns = Object.values(txnData).filter((v: any) => Array.isArray(v));
      if (rawTxns.length > 0 && Array.isArray(rawTxns[0])) {
        rawTxns = rawTxns[0];
      }
    }
    if (!Array.isArray(rawTxns)) return [];
    return rawTxns.map((txn: any) => {
      const rawAmount = txn.amount ?? txn.value ?? 0;
      const isCredit = (txn.type || txn.transactionType || "").toLowerCase() === "credit" || Number(rawAmount) >= 0;
      return {
        date: txn.date || txn.createdAt || txn.transactionDate || "",
        description: txn.description || txn.narrative || txn.reference || "Transaction",
        amount: `${isCredit ? "+" : "-"}₦${Math.abs(Number(rawAmount)).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
        positive: isCredit,
      };
    });
  }, [txnData]);

  const popularEventsList = events.slice(0, 4);

  const myEventsList = useMemo(() => {
    if (!events || events.length === 0) return [];
    return events.slice(0, 6).map((event: any, index: number) => ({
      id: event.id || index,
      title: event.title || event.name || "Event",
      description: event.description || event.short_description || "No description",
      image: event.image || event.cover_image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80",
    }));
  }, [events]);

  const handleSendMoney = async () => {
    if (!recipientPhone || !sendAmount) return;
    setTransferError(null);
    try {
      const payload: any = { phone: recipientPhone.trim(), amount: Number(sendAmount) };
      if (sendDesc.trim()) payload.description = sendDesc.trim();
      await transferFunds(payload).unwrap();
      toast.success("Transfer successful!");
      setSendOpen(false);
      setRecipientPhone("");
      setSendAmount("");
      setSendDesc("");
      if (accountNumber && accountNumber !== "N/A") {
        getBalance({ accountNo: accountNumber });
      }
    } catch (err: any) {
      setTransferError(err?.data?.message || "Transfer failed. Please try again.");
    }
  };

  if (!mounted) {
    return (
      <div className="flex-1 bg-[#F5F5F5] min-h-screen p-6 overflow-y-auto">
        <WelcomeGreeting />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <BalanceSkeleton />
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4" />
            <TableSkeleton />
          </div>
        </div>
        <section className="mb-8">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        </section>
        <section>
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[148px]">
                <div className="rounded-xl aspect-square bg-gray-200 animate-pulse mb-2" />
                <div className="h-3.5 w-3/4 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F5F5F5] min-h-screen p-6 overflow-y-auto">
      <WelcomeGreeting />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
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
                  <Eye size={14} />
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

          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 active:scale-95 transition-all text-sm font-medium text-gray-700 rounded-full px-5 py-2.5 shadow-sm"
              onClick={() => router.push('/dashboard/transfer')}
            >
              Send Money <ArrowUpRight size={15} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Transaction History</h2>
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
              {txnLoading ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-sm text-gray-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : historyItems.length > 0 ? (
                historyItems.map((item: any, i: number) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 text-gray-500">{item.date}</td>
                    <td className="py-3 text-gray-700">{item.description}</td>
                    <td className={`py-3 font-medium ${item.positive ? "text-green-600" : "text-red-500"}`}>
                      {item.amount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-sm text-gray-400">
                    No recent transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Popular event</h2>
        {eventsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularEventsList.length > 0 ? (
              popularEventsList.map((event: any, idx: number) => (
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

      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">My events</h2>
        {eventsLoading ? (
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[148px]">
                <div className="rounded-xl aspect-square bg-gray-200 animate-pulse mb-2" />
                <div className="h-3.5 w-3/4 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {myEventsList.length > 0 ? (
              myEventsList.map((event: any) => (
                <div
                  key={event.id}
                  className="cursor-pointer group flex-shrink-0 w-[148px]"
                  onClick={() => router.push(`/dashboard/events/${event.id}`)}
                >
                  <div className="rounded-xl overflow-hidden mb-2 aspect-square bg-gray-200">
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{event.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{event.description}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No events available. Browse events to get started!</p>
            )}
          </div>
        )}
      </section>

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
            {transferError && <p className="text-sm text-red-500 mb-3">{transferError}</p>}
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
  );
}