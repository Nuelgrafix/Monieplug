"use client"
import React, { useState } from 'react';
// import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginInfo: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [ninNumber, setNinNumber] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleCreateAccount = async () => {
    if (!fullName || !ninNumber || !phoneNumber) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Your KYC update logic here (API call, validation, etc.)
      // const response = await updateKYC({ fullName, ninNumber, phoneNumber });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard or verification page
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Account creation failed:', error);
      alert('Account creation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='bg-[#5075FF] lg:bg-white min-h-screen flex items-center justify-center p-2 sm:p-4'>
      {/* Desktop Layout */}
      <div className='hidden sm:block w-full max-w-[950px] min-h-[500px] bg-[#5075FF] rounded-[24px] sm:rounded-[32px] border-2 border-[#F9F9F933] p-2 sm:p-6'>
        <div className='bg-white min-h-[440px] flex flex-col lg:flex-row gap-8 sm:gap-[63px] justify-center items-center w-full rounded-[16px] sm:rounded-[24px] overflow-hidden'>
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
            <h2 className='text-[#333333] text-[18px] sm:text-[24px] md:text-[28px] lg:text-[30px] font-bold mb-2'>Update your Info for KYC</h2>
            <div className='w-full space-y-3'>
              <input 
                type="text" 
                placeholder="Full name as shown in NIN"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                className='w-full max-h-[48px] px-3 py-2 text-[16px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
              />
              <input 
                type="text" 
                placeholder="Your NIN number"
                value={ninNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNinNumber(e.target.value)}
                className='w-full max-h-[48px] px-3 py-2 text-[16px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                className='w-full max-h-[48px] px-3 py-2 text-[16px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
              />
            </div>
            <button 
              onClick={handleCreateAccount}
              disabled={isLoading}
              className='w-full bg-[#1843E2] flex justify-center items-center gap-2 hover:bg-[#4060E8] transition-colors text-[18px] border-solid border-2 border-[#1843E2] max-h-[60px] rounded-[8px] text-white py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
            <div className='flex items-center gap-4 w-[30px] mx-auto sm:w-[40px] my-2'>
              <div className='flex-1 h-px bg-gray-300'></div>
            </div>
            <button className='w-full max-h-[60px] border border-gray-300 py-2 text-sm rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'>
              <Image src="/google.png" alt="Google Icon" width={20} height={20} />
            </button>
            <p className='text-[13px] sm:text-[14px] text-gray-600 mt-2 text-center'>
              Already have an account? <Link href="/login" className='text-[#5075FF] hover:underline'>Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='block sm:hidden w-full max-w-[338px] bg-[#A9BCFF] rounded-[24px] p-4 mx-auto'>
        <div className='w-full p-2 bg-white rounded-[24px] flex flex-col items-center gap-3 min-h-[650px]'>
          {/* Profile Image Section */}
          <div className='w-full h-[280px] relative flex-shrink-0'>
            <Image 
              src="/generated-image-1.png" 
              alt="Login Image" 
              width={422} 
              height={540}
              className='w-full h-[280px] py-2 rounded-[24px] object-cover'
            />
            <Image 
              src="/logo.jpg" 
              alt='monieplug logo' 
              width={1000} 
              height={1000}
              className='absolute bottom-[10px] left-0 h-[32px] w-[100px] rounded-tr-[10px]'
            />
          </div>
          {/* KYC form */}
          <div className='w-full px-2 flex flex-col justify-center'>
            <h2 className='text-[#333333] text-[20px] font-bold mb-4 text-center'>
              Update your Info for KYC
            </h2>
            
            <div className='w-full flex flex-col items-center gap-3'>
              <input 
                type="text" 
                placeholder="Full name as shown in NIN"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                className='w-full h-[48px] text-[#565655] px-3 py-2 text-[16px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
              />
              <input 
                type="text" 
                placeholder="Your NIN number"
                value={ninNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNinNumber(e.target.value)}
                className='w-full h-[48px] px-3 py-2 text-[16px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                className='w-full h-[48px] px-3 py-2 text-[16px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
              />
              <button 
                onClick={handleCreateAccount}
                disabled={isLoading}
                className='w-full p-3 bg-[#1843E2] hover:bg-[#4060E8] transition-colors h-[48px] rounded-[8px] text-white text-[16px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>

            <div className='flex items-center gap-4 w-[30px] mx-auto my-4'>
              <div className='flex-1 h-px bg-gray-300'></div>
            </div>

            <button className='w-full h-[48px] border border-gray-300 py-2 text-sm rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'>
              <Image src="/google.png" alt="Google Icon" width={20} height={20} />
            </button>

            <p className='text-[13px] text-gray-600 mt-4 mb-4 text-center'>
              Already have an account? <Link href="/login" className='text-[#5075FF] hover:underline'>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginInfo;