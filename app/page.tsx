"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Zap, Users, Smartphone, CreditCard, BarChart3, Star } from 'lucide-react';
import LandingHeader from '@/components/Landingpage/Header';
import LandingHero from '@/components/Landingpage/Hero';
import LandingFeatures from '@/components/Landingpage/Features';
import HowScan2PayWorks from '@/components/Landingpage/HowToscan';
import StartTodaySection from '@/components/Landingpage/Start';
import GetSupportSection from '@/components/Landingpage/GetSupport';
import FooterCTA from '@/components/Landingpage/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <LandingHeader/>

      {/* Hero Section */}
      <section>
        <LandingHero/>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <LandingFeatures/>
      </section>

      {/* How it Works Section */}
     <section>
      <HowScan2PayWorks/>
     </section>

      <section>
        <StartTodaySection/>
      </section>

      {/* CTA Section */}
      <section className="">
        <GetSupportSection/>
      </section>
<hr className='text-[#A9BCFF]'/>
      {/* Footer */}
      <footer className="">
       <FooterCTA/>
      </footer>
    </div>
  );
};

export default LandingPage;