"use client"
import React from 'react'
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { BiPlus } from 'react-icons/bi'
import { MdArrowForward } from 'react-icons/md'
import TransactionHistory from '@/components/history/history.component';
// import Image from 'next/image'
// import { IoMdNotificationsOutline } from "react-icons/io";

const page = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
  
  return (
    <div className="w-full">
      <div className="w-full">
        <div className='flex bg-white gap-6 lg:gap-12 xl:gap-20 w-full max-w-none lg:max-w-6xl xl:max-w-7xl min-h-[291px] px-6 py-4 rounded-[16px]'>
          <div className='flex flex-col items-start gap-3 flex-1 min-w-0'>
            <h1 className='font-bold text-2xl lg:text-3xl xl:text-4xl'>
            Welcome to Monieplug</h1>
            <div className='w-full max-w-lg xl:max-w-xl h-auto min-h-[128px] rounded-[12px] gap-8
             p-6 bg-gradient-to-b from-[#1843E2] to-[#1185C8] mt-2'>
              <div className='flex items-center justify-between'>
              <div className='flex items-start flex-col'>
                  <span className='relative text-lg lg:text-xl text-[#FFFFFF] font-normal'>
                  Current Balance
                  <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute -right-[30px] top-1/2 transform -translate-y-1/2 text-white'
                  type="button"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                  </span>
                  <span className='text-3xl lg:text-4xl xl:text-5xl text-[#FFFFFF] font-bold mt-2'>₦ 0.00</span>
              </div>
              <span className='text-[#E0E0E0] text-xl lg:text-2xl'>9038340539</span>
              </div>
            </div>
            <div className="flex gap-2 items-center mt-3">
              <button className="flex justify-center items-center gap-1 bg-[#FFFFFF] w-auto min-w-[137px] h-[43px]
               border border-[#E0E0E0] px-4 py-3 rounded-[100px]">Add Money <BiPlus /></button>
              <button className="flex justify-center items-center gap-1 bg-[#FFFFFF] w-auto min-w-[137px] h-[43px]
               border border-[#E0E0E0] px-4 py-3 rounded-[100px]">Send Money <MdArrowForward /></button>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="w-full">
              <TransactionHistory />
            </div>
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default page