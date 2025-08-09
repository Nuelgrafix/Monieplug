import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { LuLogOut } from "react-icons/lu";

const NavBar = () => {
  return (
    <div className='fixed top-0 left-0 w-[195px] h-screen bg-[#1843E2] z-50 px-4 lg:px-8'>
      <div className='flex flex-col w-full gap-[30px] items-start mt-[40px]'>
      <div className='w-[145px] gap-[32px] flex flex-col items-start h-[112px] '>
        <Image src="/logo.jpg" alt="Monieplug Logo" width={100} height={100} className='w-[106px] h-[32px] rounded-[4px]' />
        <Link href="/" className='flex justify-center items-center text-white max-w-[140px] h-[48px] px-[20px] py-[12px] rounded-[8px] border border-[#FF7F00] text-[16px] bg-[#FF7F00] font-semibold'>
        Create event
        </Link>
      </div>
      <div className='w-[145px] gap-[100px] flex flex-col items-start'>
        <div className='w-[145px] gap-[16px] flex flex-col items-start'>
         <Link href="/" className='text-[#282828] flex justify-center items-center py-[8px] px-[14px]
            bg-[#7B97FF] focus:text-[#1843E2] focus:bg-[white] 
            w-[140px] h-[35px] rounded-[8px] text-[16px] font-bold'>
            Home</Link>
         <Link href="/" className='text-[#282828] flex justify-center items-center py-[8px] px-[14px]
            bg-[#7B97FF] focus:text-[#1843E2] focus:bg-[white] 
            w-[140px] h-[35px] rounded-[8px] text-[16px] font-bold'> 
            Events</Link>
         <Link href="/" className='text-[#282828] flex justify-center items-center py-[8px] px-[14px]
            bg-[#7B97FF] focus:text-[#1843E2] focus:bg-[white] 
            w-[140px] h-[35px] rounded-[8px] text-[16px] font-bold'>
            Scan2Pay</Link>
         <Link href="/" className='text-[#282828] flex justify-center items-center py-[8px] px-[14px]
            bg-[#7B97FF] focus:text-[#1843E2] focus:bg-[white] 
            w-[140px] h-[35px] rounded-[8px] text-[16px] font-bold'>
            Profile</Link>
          </div>
          <div className="w-[145px] h-[52px] rounded-[8px] text-[#282828] flex justify-center items-center py-[8px] px-[14px]
            bg-[#7B97FF] cursor-pointer focus:text-[#1843E2] gap-2 focus:bg-[white] text-[16px] font-bold">
            <LuLogOut className="w-[18px] h-[18px] text-[30px] font-bold" />
            <span>Log Out</span>
          </div>
      </div>
           
      </div>
    </div>
  )
}

export default NavBar