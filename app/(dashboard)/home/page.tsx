"use client"
import React from 'react'
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
// Note: BiPlus and MdArrowForward are from react-icons which isn't available
// Using lucide-react alternatives
import { Plus, ArrowRight, Copy } from 'lucide-react';
import TransactionHistory from '@/components/history/history.component'
import Event from '@/components/home-event/event.component';

const page = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showCopyMessage, setShowCopyMessage] = useState<boolean>(false);
    const accountNumber = "9038340539";

    const copyToClipboard = () => {
      navigator.clipboard.writeText(accountNumber).then(() => {
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 2000); // Hide after 3 seconds
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    };
  
  return (
    <div className="w-full">
      {showCopyMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="w-full max-w-lg xl:max-w-xl h-auto min-h-[128px] rounded-[12px] gap-8 p-6 bg-gradient-to-b from-[#1843E2] to-[#1185C8] flex items-center justify-center">
            <span className="text-[20px] lg:text-[24px] text-[#FFFFFF] font-normal text-center">
                You have successfully copied this code
            </span>
          </div>
        </div>
      )}
      
      <div className="w-full">
        <div className='flex flex-col lg:flex-row bg-white gap-6 lg:gap-12 xl:gap-20 w-full min-h-[291px] px-4 sm:px-6 py-4 rounded-[16px]'>
          <div className='flex flex-col items-start gap-3 flex-1 min-w-0'>
            <h1 className='font-bold text-xl sm:text-2xl lg:text-3xl xl:text-4xl'>
            Welcome to Monieplug</h1>
            <div className='w-full max-w-lg xl:max-w-xl h-auto min-h-[128px] rounded-[12px] gap-8
             p-4 sm:p-6 bg-gradient-to-b from-[#1843E2] to-[#1185C8] mt-2'>
              <div className='flex flex-row items-center justify-between gap-4 sm:gap-0'>
              <div className='flex items-start flex-col'>
                  <span className='relative text-[16px] sm:text-[20px] text-[#FFFFFF] font-normal'>
                  Current Balance
                  <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute cursor-pointer -right-[30px] top-1/2 transform -translate-y-1/2 text-white'
                  type="button"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                  </span>
                  <span className='text-[30px] sm:text-[40px] text-[#FFFFFF] font-bold mt-2'>₦
                    <span className='text-[35px] sm:text-[45px]'>
                      {showPassword ? '0.00' : '****'}
                    </span>
                  </span>
              </div>
              <span className='text-[#E0E0E0] flex gap-[10px] items-center text-[18px] sm:text-[24px]'>
                <span className="hidden sm:inline">{accountNumber}</span>
                <span className="sm:hidden">{accountNumber.slice(0, 6)}...</span>
                <Copy 
                  className='cursor-pointer hover:text-white transition-colors' 
                  onClick={copyToClipboard}
                  size={20}
                />
              </span>
              </div>
            </div>
            <div className="flex flex-row gap-2 items-stretch sm:items-center mt-3 w-full sm:w-auto">
              <button className="flex justify-center items-center gap-1 bg-[#FFFFFF] w-full sm:w-auto min-w-[137px] h-[43px]
               border border-[#E0E0E0] px-4 py-3 rounded-[100px] bg-[#F9F9F9] lg:bg-transparent">Add Money <Plus size={20} /></button>
              <button className="flex justify-center items-center gap-1 bg-[#FFFFFF] w-full sm:w-auto min-w-[137px] h-[43px]
               border border-[#E0E0E0] px-4 py-3 rounded-[100px] bg-[#F9F9F9] lg:bg-transparent">Send Money <ArrowRight size={20} /></button>
            </div>
          </div>
          <div className="flex-1 min-w-0 w-full lg:w-auto">
            <div className="w-full">
              <TransactionHistory />
            </div>
          </div>
        </div>

        
      </div>
      <div className='min-h-screen mt-12 sm:mt-20'>
        <Event />
      </div>
    </div>
  )
}

export default page