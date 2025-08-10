"use client";

import React, { useActionState, useState } from "react";
import { useFormStatus } from "react-dom"; // Ensure this is still correct for your version
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

  // useEffect(() => {
  //   if (formState?.message) {
  //     toast.info(formState.message);
  //   }
  // }, [formState?.message]);

  return (
    <main className="bg-[#5075FF] lg:bg-white min-h-screen flex items-center justify-center p-2 sm:p-4">
      <div className="flex w-full max-w-[950px] h-auto bg-[#A9BCFF] md:bg-[#5075FF] rounded-[24px] sm:rounded-[32px] border-2 border-[#F9F9F933] p-3 sm:p-6">
        <div className="bg-white min-h-[440px] flex flex-col md:flex-row justify-between items-center w-full rounded-[16px] sm:rounded-[24px] overflow-hidden">
          <SidebarContainer />

          <form
            action={formAction}
            className="w-full md:max-w-[400px] p-4 sm:p-5 h-auto sm:h-[457px] mx-auto flex flex-col justify-center items-center gap-3 sm:px-8"
          >
            <h3 className="text-[#333333] text-[18px] sm:text-[24px] md:text-[28px] mb-1">
              Sign in to your account
            </h3>
            <div className=" w-full">
              <div
                className={clsx(
                  formState?.errors?.email && formStyles.inputContainer,
                  "mt-4 border-red-500"
                )}
              >
                <input
                  placeholder="Continue with email"
                  type="email"
                  name="email"
                  id="email"
                  className="w-full border rounded-lg px-3 py-2"
                />
                {formState?.errors?.email && (
                  <p className="text-red-500">{formState.errors.email[0]}</p>
                )}
              </div>
              <div
                className={clsx(
                  formState?.errors?.password && formStyles.inputContainer,
                  "mt-4 border-red-500 relative "
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
                  className="w-full border rounded-lg px-3 py-2"
                />
                {formState?.errors?.password && (
                  <p className="text-red-500">{formState.errors.password[0]}</p>
                )}
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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

            <div className="flex items-center gap-4 w-[30px] mx-auto sm:w-[40px] my-2">
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <button className="w-full max-h-[60px] border border-gray-300 py-2 text-sm rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Image
                src="/logo/google.png"
                alt="Google Icon"
                width={20}
                height={20}
              />
            </button>
            <p className="text-[13px] sm:text-[14px] text-gray-600 mt-2 text-center">
              Don't have an account?{" "}
              <Link
                href={routes.signUp()}
                className="text-[#5075FF] hover:underline"
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
    <button type="submit" className={formStyles.btn} disabled={pending}>
      {pending ? "Logging in..." : "Continue"}
    </button>
  );
};

export default LoginPage;
