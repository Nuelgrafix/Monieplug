"use client"
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For App Router
// import { useRouter } from 'next/router'; // For Pages Router

const SignupUI: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Your signup logic here (API call, validation, etc.)
      // const response = await signupUser({ email, password });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to email verification page
      router.push('/email-verification');
      
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
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
              alt="Signup Image" 
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
            <h2 className='text-[#333333] text-[18px] sm:text-[24px] md:text-[28px] lg:text-[30px] font-bold mb-2'>Create a Monieplug account.</h2>
            <div className='w-full space-y-3'>
              <input 
                type="email" 
                placeholder="Continue with email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className='w-full max-h-[48px] px-3 py-2 text-[16px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
              />
              <div className='relative'>
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className='w-full max-h-[48px] px-3 py-2 text-[16px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                  type="button"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button 
              onClick={handleContinue}
              disabled={isLoading}
              className='w-full bg-[#1843E2] flex justify-center items-center gap-2 hover:bg-[#4060E8] transition-colors text-[18px] border-solid border-2 border-[#1843E2] max-h-[60px] rounded-[8px] text-white py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Loading...' : 'Continue'}
            </button>
            <div className='flex items-center gap-4 w-[30px] mx-auto sm:w-[40px] my-2'>
              <div className='flex-1 h-px bg-gray-300'></div>
            </div>
            <button className='w-full max-h-[60px] border border-gray-300 py-2 text-sm rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'>
              <Image src="/google.png" alt="Google Icon" width={20} height={20} />
            </button>
            <p className='text-[13px] sm:text-[14px] text-gray-600 mt-2 text-center'>
              Already have an account? <Link href="/" className='text-[#5075FF] hover:underline'>Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='block lg:hidden w-[306px] h-[697px] bg-[#A9BCFF] rounded-[24px] p-4 mx-auto'>
        <div className='w-full h-full bg-white rounded-[24px] p-3 flex flex-col items-center gap-6'>
          {/* Profile Image Section */}
          <div className='w-full max-w-[422px] h-[220px] sm:h-[540px] relative ml-0 lg:ml-[20px] flex-shrink-0'>
            <Image 
              src="/generated-image-1.png" 
              alt="Signup Image" 
              width={422} 
              height={540}
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
            <h2 className='text-[#333333] text-[20px] xs:text-[22px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold mb-2'>
              Create a Monieplug account.
            </h2>
            
            <div className='w-full space-y-4'>
              <input 
                type="email" 
                placeholder="Continue with email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className='w-full max-h-[44px] px-3 py-2 text-[14px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
              />
              <div className='relative'>
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className='w-full max-h-[44px] px-3 py-2 text-[14px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              onClick={handleContinue}
              disabled={isLoading}
              className='w-full bg-[#1843E2] hover:bg-[#4060E8] transition-colors max-h-[48px] rounded-[8px] text-white text-[16px] font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Loading...' : 'Continue'}
            </button>
            <div className='flex items-center gap-4 w-[30px] mx-auto my-4'>
              <div className='flex-1 h-px bg-gray-300'></div>
            </div>

            <button className='w-full max-h-[50px] sm:h-[60px] border border-gray-300 py-2 text-sm rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'>
              <Image src="/google.png" alt="Google Icon" width={20} height={20} />
            </button>

            <p className='text-[13px] text-gray-600 mt-6 text-center'>
              Already have an account? <Link href="/" className='text-[#5075FF] hover:underline'>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default SignupUI;