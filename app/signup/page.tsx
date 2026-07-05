"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { signupStart, signupSuccess, signupFailure, clearError } from "@/redux/slices/authSlice";
import { useSignupMutation, useVerifyEmailMutation } from "@/redux/slices/apiSlice";
import toast from 'react-hot-toast';
import * as yup from 'yup';

// Validation schemas
const step1Schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
});

const step2Schema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  date_of_birth: yup.string().required('Date of birth is required'),
  gender: yup.string().oneOf(['0', '1'], 'Please select a valid gender').required('Gender is required'),
  address: yup.string().required('Address is required'),
  bvn: yup.string().required('BVN is required'),
});

const passwordSchema = yup.object().shape({
  password: yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
});

const confirmPasswordSchema = yup.object().shape({
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords do not match').required('Please confirm your password'),
});

// ── Swap these in /public ──
const LOGO_SRC        = "/logo.jpg";
const STEP1_IMG       = "/su1.png";   // man on phone (steps 1 & 2)
const STEP3_IMG       = "/su3.png";   // dark tech image (step 3)
const STEP4_IMG       = "/su4.png"; // no longer used (kept for reference)

type Step = 1 | 2;

/* ─────────────────────────────────────────
   Shared card shell
 ───────────────────────────────────────── */


function Card({
  img,
  children,
}: {
  img: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl flex overflow-hidden w-full max-w-[520px]">
      {/* Left image */}
      <div className="hidden sm:flex flex-col justify-between w-[200px] flex-shrink-0 bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" className="w-full h-full object-cover" />
        {/* Logo badge */}
        <div className="absolute bottom-4 left-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 p-7 flex flex-col">{children}</div>
    </div>
  );
}

/* Logo inside card bottom-left overlay */
function CardLogo() {
  return (
    <div className="mt-auto pt-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_SRC} alt="Monieplug" className="h-6 w-auto" />
    </div>
  );
}

/* Blue primary button */
function Btn({
  label,
  onClick,
  loading = false,
}: {
  label: string;
  onClick?: () => void;
  loading?: boolean;
}) {
  const isDisabled = loading;
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="w-full bg-[#2338e0] hover:bg-[#1a2bbf] active:scale-95 text-white font-semibold text-sm py-3 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        label
      )}
    </button>
  );
}

/* ─────────────────────────────────────────
   Page wrapper (blurred bg + footer)
───────────────────────────────────────── */
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center "
      style={{ backgroundImage: "url('/subg.png')" }}
    >
      {/* Blurred dark overlay */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 backdrop-blur-sm bg-black/50">
        {children}
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 flex items-center justify-between text-xs backdrop-blur-sm bg-black/50">
        <span>© monieplug, all right reserved</span>
        <nav className="flex gap-4">
          <a href="/terms"   className="hover:text-white transition-colors">Terms</a>
          <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
          <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
        </nav>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   STEP 1 — Email + phone
═══════════════════════════════════════ */
function Step1({ next, signupData, setSignupData }: {
  next: () => void;
  signupData: any;
  setSignupData: (data: any) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl flex p-4 overflow-hidden w-full max-w-[820px]">
      <div className="hidden sm:block w-[200px] flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STEP1_IMG} alt="" className="w-full h-full rounded-lg" />
      </div>
      <div className="flex-1 p-7 flex flex-col gap-4">
        <div>
          <p className="text-gray-500 text-sm">Welcome to Monieplug</p>
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <div className="mt-1 w-10 h-0.5 bg-gray-900" />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={signupData.email}
          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Phone with country code */}
        <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="tel"
            placeholder="Phone number"
            value={signupData.phone}
            onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
            className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
          />
        </div>

        <Btn label="Next" onClick={next} />

        <p className="text-center text-xs text-gray-500">
          Not a new user?{" "}
          <a href="/signin" className="text-blue-600 font-semibold underline">
            Sign in
          </a>
        </p>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
    STEP 2 — Personal details
 ═══════════════════════════════════════ */
   function Step2({ next, back, signupData, setSignupData, loading = false }: {
    next: () => void;
    back?: () => void;
    signupData: any;
    setSignupData: (data: any) => void;
    loading?: boolean;
   }) {
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
      <div className="bg-white rounded-2xl shadow-xl flex overflow-hidden w-full max-w-[820px] h-[80vh]">
        {/* Fixed Full-Height Image */}
        <div className="hidden sm:block w-[200px] flex-shrink-0 h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={STEP1_IMG} 
            alt="" 
            className="w-full h-full object-cover rounded-l-2xl" 
          />
        </div>
  
        {/* Scrollable Form Area */}
        <div className="flex-1 p-7 flex flex-col gap-3 overflow-y-auto pr-2">
         <div>
           <p className="text-gray-500 text-sm">Kindly fill the form to</p>
           <h2 className="text-2xl font-bold text-gray-900">Complete Your Details</h2>
           <div className="mt-1 w-10 h-0.5 bg-gray-900" />
         </div>

         <input
           type="text"
           placeholder="First Name"
           value={signupData.first_name}
           onChange={(e) => setSignupData({ ...signupData, first_name: e.target.value })}
           className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
         />

         <input
           type="text"
           placeholder="Last Name"
           value={signupData.last_name}
           onChange={(e) => setSignupData({ ...signupData, last_name: e.target.value })}
           className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
         />

         <input
           type="date"
           placeholder="Date of Birth"
           value={signupData.date_of_birth}
           onChange={(e) => setSignupData({ ...signupData, date_of_birth: e.target.value })}
           className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
         />

         <select
           value={signupData.gender}
           onChange={(e) => setSignupData({ ...signupData, gender: e.target.value })}
           className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
         >
           <option value="">Select Gender</option>
           <option value="0">Male</option>
           <option value="1">Female</option>
         </select>

         <input
           type="text"
           placeholder="Address"
           value={signupData.address}
           onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
           className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
         />

         <input
           type="text"
           placeholder="BVN"
           value={signupData.bvn}
           onChange={(e) => setSignupData({ ...signupData, bvn: e.target.value })}
           className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
         />

         {/* Password fields - before email verification */}
         <div className="relative">
           <input
             type={showPw ? "text" : "password"}
             placeholder="Password"
             value={signupData.password}
             onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
             className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
           <button
             type="button"
             onClick={() => setShowPw((s) => !s)}
             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 text-xs"
           >
             {showPw ? "Hide" : "Show"}
           </button>
         </div>

         <div className="relative">
           <input
             type={showConfirm ? "text" : "password"}
             placeholder="Confirm Password"
             value={signupData.confirmPassword || ''}
             onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
             className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
           <button
             type="button"
             onClick={() => setShowConfirm((s) => !s)}
             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 text-xs"
           >
             {showConfirm ? "Hide" : "Show"}
           </button>
         </div>

          {back && (
            <button
              onClick={back}
              className="text-sm text-gray-500 hover:text-gray-800 mb-2 self-start"
            >
              ← Back
            </button>
          )}
          <Btn label="Next" onClick={next} loading={loading} />

       </div>
     </div>
   );
  }


/* ═══════════════════════════════════════
    STEP 3 — Verify email OTP
 ═══════════════════════════════════════ */
/* ═══════════════════════════════════════
   ROOT — orchestrates all steps

 ═══════════════════════════════════════ */

export default function SignupPage() {
  const [step, setStep] = useState<Step>(1);
  const [signupData, setSignupData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: Array(6).fill(''),
    date_of_birth: '',
    gender: '',
    address: '',
    bvn: '',
  });
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [signup, { isLoading: apiLoading }] = useSignupMutation();
  const [verifyEmail] = useVerifyEmailMutation();

  const handleNext = async (currentStep: Step) => {
    try {
      if (currentStep === 1) {
        await step1Schema.validate(signupData);
      } else if (currentStep === 2) {
        await step2Schema.validate(signupData);
        await passwordSchema.validate(signupData);
        await confirmPasswordSchema.validate(signupData);

        // Merge + format
        const dob = signupData.date_of_birth && signupData.date_of_birth.includes('-')
          ? (() => { const [y,m,d] = signupData.date_of_birth.split('-'); return `${m}/${d}/${y}`; })()
          : signupData.date_of_birth;

        const mergedData = {
          ...signupData,
          phone: signupData.phone,
          email: signupData.email,
          date_of_birth: dob,
        };

        dispatch(signupStart());
        try {
          const { confirmPassword, otp, ...payload } = mergedData;
          const result = await signup(payload).unwrap();
          dispatch(signupSuccess({ user: result.user, token: result.token }));
          toast.success("user account created successfully");
          // Persist email so resend-code works even without ?email= in URL
          try { localStorage.setItem("signup_email", signupData.email); } catch (_) { /* noop */ }
          router.push(`/email-verification`);
        } catch (err: any) {
          dispatch(signupFailure(err?.data?.message || 'Signup failed'));
          toast.error('Signup failed');
          return; // do not proceed to verification page if signup failed
        }
      }

      // Only step 1 advances to step 2
      if (currentStep === 1) {
        setStep(2);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <PageShell>
      <div className="backdrop-blur-sm bg-white/30 p-6 rounded-lg w-[800px]">

      {step === 1 && <Step1 next={() => handleNext(1)} signupData={signupData} setSignupData={setSignupData} />}
      {step === 2 && <Step2 next={() => handleNext(2)} back={() => setStep(1)} signupData={signupData} setSignupData={setSignupData} loading={apiLoading} />}
      </div>

    </PageShell>
  );
}