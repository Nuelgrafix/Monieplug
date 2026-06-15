"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Users, Calendar, Ticket, CreditCard } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-3xl mx-auto bg-white min-h-screen p-6">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-700 hover:text-gray-900 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-bold text-gray-900">About Monieplug</h1>
        </div>

        <div className="space-y-8">
          <section>
            <p className="text-sm text-gray-600 leading-relaxed">
              Monieplug is your all-in-one platform for discovering, managing, and attending events. 
              We connect communities through memorable experiences while making financial management 
              seamless with our integrated payment solutions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              To democratize event access and financial services, creating a world where 
              communities can thrive through shared experiences and seamless transactions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Core Features</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1E35C8]/10 flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} className="text-[#1E35C8]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Event Discovery</p>
                  <p className="text-xs text-gray-500 mt-1">Browse thousands of events with our smart filtering system.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1E35C8]/10 flex items-center justify-center flex-shrink-0">
                  <Ticket size={16} className="text-[#1E35C8]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Seamless Tickets</p>
                  <p className="text-xs text-gray-500 mt-1">Purchase and manage tickets with one click.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1E35C8]/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={16} className="text-[#1E35C8]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Secure Payments</p>
                  <p className="text-xs text-gray-500 mt-1">Bank-level security for all transactions.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1E35C8]/10 flex items-center justify-center flex-shrink-0">
                  <Users size={16} className="text-[#1E35C8]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Community Building</p>
                  <p className="text-xs text-gray-500 mt-1">Connect with like-minded people through events.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Our Values</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1E35C8]"></div>
                <p className="text-sm text-gray-600">Transparency in all our operations</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1E35C8]"></div>
                <p className="text-sm text-gray-600">Innovation that serves our users</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1E35C8]"></div>
                <p className="text-sm text-gray-600">Building inclusive communities</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1E35C8]"></div>
                <p className="text-sm text-gray-600">Security and trust as priorities</p>
              </div>
            </div>
          </section>

          <section className="pt-4">
            <button
              onClick={() => router.push("/events")}
              className="w-full py-3 rounded-xl bg-[#1E35C8] text-white text-sm font-semibold hover:bg-[#1a2eb0] active:scale-[0.98] transition-all shadow-sm"
            >
              Explore Events
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}