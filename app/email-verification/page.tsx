"use client"
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const EmailVerification = () => {
 
  return (
    <main className='bg-[#5075FF] lg:bg-white min-h-screen flex items-center justify-center p-2 sm:p-4'>
      {/* Desktop Layout */}
      <div className='hidden sm:block w-full max-w-[950px] min-h-[500px] bg-[#5075FF] rounded-[24px] sm:rounded-[32px] border-2 border-[#F9F9F933] p-2 sm:p-6'>
        <div className='bg-white min-h-[440px] flex flex-col lg:flex-row gap-[40px] justify-center items-center w-full rounded-[16px] sm:rounded-[24px] overflow-hidden'>
          {/* Profile Image Section */}
          <div className='w-full max-w-[422px] h-[220px] sm:h-[540px] relative ml-0 lg:ml-[20px] flex-shrink-0'>
            <Image 
              src="/generated-image-1.png" 
              alt="Login Image" 
              width={422} 
              height={540}
              className='w-full sm:w-[422px] h-[220px] sm:h-[540px] py-2 sm:py-5 rounded-[24px] sm:rounded-[40px] object-cover'
            />
            <Image 
              src="/logo.jpg" 
              alt='monieplug logo' 
              width={1000} 
              height={1000}
              className='absolute bottom-[10px] lg:bottom-[20px] left-0 h-[32px] sm:h-[43px] w-[100px] sm:w-[142.7px] rounded-tr-[10px] sm:rounded-tr-[16px]'
            />
          </div>
          <div className='w-full max-w-[422px] sm:p-5 h-auto sm:h-[457px] mx-auto flex flex-col justify-center items-center gap-4 sm:px-8'>
            <h2 className='text-[#333333] text-[18px]
             sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold mb-2'>
             Enter code sent to your email address</h2>
            <div className='w-full flex justify-center gap-2 sm:gap-4 mb-4'>
            {[...Array(6)].map((_, index) => (
                <input 
                key={index}
                placeholder='0'
                type="text"
                maxLength={1}
                className='w-[38px] h-[44px] sm:w-[50px] sm:h-[50px] text-center text-[20px] sm:text-[24px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5075FF] transition-all'
                />
            ))}
            </div>
            <button className='w-full bg-[#1843E2]
             flex justify-center items-center gap-2 hover:bg-[#4060E8]
              transition-colors text-[18px] border-solid border-2 border-[#1843E2] max-h-[50px] sm:h-[60px] rounded-[8px] text-white py-2 text-sm font-semibold'>
              Verify
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Matches your specifications exactly */}
      
        <div className='block lg:hidden w-[306px] h-[697px] bg-[#A9BCFF] rounded-[24px] p-4 mx-auto'>
          <div className='w-full h-full bg-white rounded-[24px]  flex flex-col items-center gap-6'>
            {/* Profile Image Section */}
            <div className='w-full max-w-[422px] p-4 h-[220px] sm:h-[540px] relative ml-0 lg:ml-[20px] flex-shrink-0'>
            <Image 
              src="/generated-image-1.png" 
              alt="Login Image" 
              width={1000} 
              height={1000}
              className='w-full sm:w-[422px] h-[220px] sm:h-[540px] py-2 sm:py-5 rounded-[24px] sm:rounded-[40px] object-cover'
            />
            <Image 
              src="/logo.jpg" 
              alt='monieplug logo' 
              width={1000} 
              height={1000}
              className='absolute bottom-[10px] left-0 h-[32px] sm:h-[43px] w-[100px] sm:w-[142.7px] rounded-tr-[10px] sm:rounded-tr-[16px]'
            />
          </div>


            {/* Sign in form */}
            <div className='w-full px-2'>
            <h2 className='text-[#333333]
                text-[20px] xs:text-[22px] sm:text-[24px]
                md:text-[28px] lg:text-[32px] font-bold 
                mb-2
                text-center'>Enter code sent to your email address
            </h2>
            <div className='w-full flex justify-center gap-2 sm:gap-4 mb-4'>
                {[...Array(6)].map((_, index) => (
                    <input 
                    key={index}
                    placeholder='0'
                    type="text"
                    maxLength={1}
                    className='w-[36px] h-[36px] text-center text-[20px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5075FF] transition-all'
                    />
                ))}
                </div>
              <button className='w-full bg-[#1843E2]
               hover:bg-[#4060E8] transition-colors h-[48px] rounded-[8px] text-white
                text-[16px] font-semibold mt-6'>
                Verify
              </button>
            </div>
          </div>
        </div>
    </main>
  )
}

export default EmailVerification;