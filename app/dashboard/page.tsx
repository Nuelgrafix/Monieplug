import NavBar from '@/components/NavBar'
import React from 'react'
import { BiSearch, BiPlus } from 'react-icons/bi'
import { MdArrowForward } from 'react-icons/md'
import Image from 'next/image'
import { IoMdNotificationsOutline } from "react-icons/io";

const page = () => {
  return (
    <div className='bg-[#F8F8F8] min-h-screen'>
      <NavBar />
      
      {/* Main Content Area */}
      <div className='ml-[195px] p-6'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-[32px] font-bold text-[#5075FF]'>Dashboard</h1>
          
          {/* Search Bar */}
            <div className='relative'>
              <BiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input 
                type="text" 
                placeholder="Search event"
                className='pl-10 pr-4 py-[10px] text-[#667085] px-[14px] w-[493px] h-[44px]
                 border border-[#D0D5DD] rounded-[8px] bg-white focus:outline-none focus:border-[#1843E2]'
              />
            </div>
            
            {/* Notification and Profile */}
            <div className='flex items-center gap-[8px]'>
              <div className="relative inline-block">
      <IoMdNotificationsOutline className='w-[32px] h-[32px] text-gray-700' />
      <div 
        className="absolute w-[14px] h-[14px] rounded-[355.29px] p-2 gap-[5.65px] top-[-3px] left-[14px] transform rotate-0 bg-orange-500 text-white text-[8px] font-normal flex items-center justify-center"
      >
        20
      </div>
    </div>
              <Image
                src="/profile-img.png"
                width={100}
                height={100}
                className='w-[40px] h-[40px] rounded-full cursor-pointer'
                alt='Profile Image'
                loading='lazy'
                />
              <span className='text-[#181818] font-medium'>Emmanuel</span>
            </div>
        </div>

        <div>
          <div className='flex flex-col items-start gap-1'>
            <h1 className='font-bold text-[32px]'>Welcome to Monieplug</h1>
            <div className='w-[511px] h-[128px] rounded-[12px] gap-[32px]
             p-[24px] bg-gradient-to-b from-[#1843E2] to-[#1185C8] mt-3'>
              <span className='text-[20px] text-[#FFFFFF] font-normal'>Current Balance</span>

            </div>
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default page