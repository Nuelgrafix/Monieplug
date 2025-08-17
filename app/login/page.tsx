"use client";

import React, { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import clsx from "clsx";
import { toast } from "react-toastify";
import formStyles from "@/styles/form.module.css";
import Link from "next/link";
import Image from "next/image";
import SidebarContainer from "../(auth)/sidebar-container.component";
import login, { InitialState } from "./actions/login.action";
import SvgIcon from "@/components/svg-icon/svg-icon.component";
import routes from "@/helpers/routes";

const initialState: InitialState = {};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [formState, formAction] = useActionState(login, initialState);

  if (formState?.message) {
    toast.info(formState.message);
  }

  return (
    <main className='bg-[#5075FF] lg:bg-white min-h-screen flex items-center justify-center p-2 sm:p-4'>
      {/* Desktop Layout */}
      <div className='hidden sm:block w-full max-w-[950px] min-h-[500px] bg-[#5075FF] rounded-[24px] sm:rounded-[32px] border-2 border-[#F9F9F933] p-2 sm:p-6'>
        <div className='bg-white min-h-[440px] flex flex-col lg:flex-row gap-8 sm:gap-[63px] justify-center items-center w-full rounded-[16px] sm:rounded-[24px] overflow-hidden'>
          <SidebarContainer />

          <form
            action={formAction}
            className='w-full max-w-[422px] sm:p-5 h-auto sm:h-[457px] mx-auto flex flex-col justify-center items-center gap-4 sm:px-8'
          >
            <h2 className='text-[#333333] text-[20px] font-bold mb-4 text-center'>Sign in to your account</h2>
            <div className='w-full space-y-3'>
              <div
                className={clsx(
                  formState?.errors?.email && formStyles.inputContainer,
                  "border-red-500"
                )}
              >
                <input
                  type="email"
                  placeholder="Continue with email"
                  name="email"
                  id="email"
                  className='w-full max-h-[48px] px-3 py-2 text-[16px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
                />
                {formState?.errors?.email && (
                  <p className="text-red-500 text-sm mt-1">{formState.errors.email[0]}</p>
                )}
              </div>
              <div className='relative w-full'>
                <div
                  className={clsx(
                    formState?.errors?.password && formStyles.inputContainer,
                    "border-red-500"
                  )}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    id="password"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    className='w-full max-h-[48px] px-3 py-2 text-[16px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
                  />
                  {formState?.errors?.password && (
                    <p className="text-red-500 text-sm mt-1">{formState.errors.password[0]}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                  type="button"
                >
                  {showPassword ? (
                    <SvgIcon className={clsx("")} iconName="TbEyeOff" />
                  ) : (
                    <SvgIcon className={clsx("")} iconName="TbEye" />
                  )}
                </button>
              </div>
            </div>
            <FormButton />
            <div className='flex items-center gap-4 w-[30px] mx-auto sm:w-[40px] my-2'>
              <div className='flex-1 h-px bg-gray-300'></div>
            </div>
            <button className='w-full max-h-[60px] border border-gray-300 py-2 text-sm rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'>
              <Image src="/logo/google.png" alt="Google Icon" width={20} height={20} />
            </button>
            <p className='text-[13px] sm:text-[14px] text-gray-600 mt-2 text-center'>
              Don't have an account? <Link href={routes.signUp()} className='text-[#5075FF] hover:underline'>Sign up</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='block sm:hidden w-full max-w-[338px] bg-[#A9BCFF] rounded-[24px] p-4 mx-auto'>
        <div className='w-full p-2 bg-white rounded-[24px] flex flex-col items-center gap-3 min-h-[650px]'>
          <SidebarContainer />
          
          {/* Sign in form */}
          <form
            action={formAction}
            className='w-full px-2 flex flex-col justify-center'
          >
            <h2 className='text-[#333333] text-[20px] font-bold mb-4 text-center'>
              Sign in to your account
            </h2>
            
            <div className='w-full flex flex-col items-center gap-3'>
              <div
                className={clsx(
                  formState?.errors?.email && formStyles.inputContainer,
                  "w-full border-red-500"
                )}
              >
                <input
                  type="email"
                  placeholder="Continue with email"
                  name="email"
                  id="email"
                  className='w-full h-[48px] text-[#565655] px-3 py-2 text-[16px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
                />
                {formState?.errors?.email && (
                  <p className="text-red-500 text-sm mt-1">{formState.errors.email[0]}</p>
                )}
              </div>
              <div className='relative w-full'>
                <div
                  className={clsx(
                    formState?.errors?.password && formStyles.inputContainer,
                    "w-full border-red-500"
                  )}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    id="password"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    className='w-full h-[48px] px-3 py-2 text-[16px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
                  />
                  {formState?.errors?.password && (
                    <p className="text-red-500 text-sm mt-1">{formState.errors.password[0]}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                  type="button"
                >
                  {showPassword ? (
                    <SvgIcon className={clsx("")} iconName="TbEyeOff" />
                  ) : (
                    <SvgIcon className={clsx("")} iconName="TbEye" />
                  )}
                </button>
              </div>
              <FormButtonMobile />
            </div>

            <div className='flex items-center gap-4 w-[30px] mx-auto my-4'>
              <div className='flex-1 h-px bg-gray-300'></div>
            </div>

            <button className='w-full max-h-[60px] border border-gray-300 py-2 text-sm rounded-lg font-semibold hover:bg-gray-50 
            transition-colors flex items-center justify-center gap-2'>
              <Image
                src="/logo/google.png"
                alt="Google Icon"
                width={20}
                height={20}
              />
            </button>

            <p className='text-[13px] text-gray-600 mt-4 mb-4 text-center'>
              Don't have an account?{" "}
              <Link
                href={routes.signUp()}
                className='text-[#5075FF] hover:underline'
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

const FormButton = () => {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className='w-full bg-[#1843E2] flex justify-center items-center gap-2 hover:bg-[#4060E8] transition-colors text-[18px] border-solid border-2 border-[#1843E2] max-h-[60px] rounded-[8px] text-white py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {pending ? 'Logging in...' : 'Continue'}
    </button>
  );
};

const FormButtonMobile = () => {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className='w-full max-h-[48px] px-3 py-2 text-[16px] rounded-lg border border-[#565655] focus:outline-none focus:ring-2 focus:ring-[#5075FF] focus:border-transparent'
    >
      {pending ? 'Logging in...' : 'Continue'}
    </button>
  );
};

export default LoginPage;