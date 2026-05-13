"use client";

import Image from "next/image";
import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { signupStart, signupSuccess, signupFailure, clearError } from "@/redux/slices/authSlice";
import { useSignupMutation } from "@/redux/slices/apiSlice";

// ── Swap these in /public ──
const LOGO_SRC        = "/logo.jpg";
const STEP1_IMG       = "/su1.png";   // man on phone (steps 1 & 2)
const STEP3_IMG       = "/su3.png";   // dark tech image (step 3)
const STEP4_IMG       = "/su4.png"; // man in suit (steps 4 & 5)

type Step = 1 | 2 | 3 | 4 | 5 | 6;

/* ─────────────────────────────────────────
   OTP / PIN input (6 boxes)
───────────────────────────────────────── */
function PinInput({
  value,
  onChange,
  show,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  show: boolean;
}) {
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const handleChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const ch = e.target.value.replace(/\D/, "").slice(-1);
    const next = [...value];
    next[i] = ch;
    onChange(next);
    if (ch && i < 5) refs[i + 1].current?.focus();
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {value.map((v, i) => (
        <input
          key={i}
          ref={refs[i]}
          type={show ? "text" : "password"}
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          className="w-11 h-11 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
}

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
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#2338e0] hover:bg-[#1a2bbf] active:scale-95 text-white font-semibold text-sm py-3 rounded-lg transition-all duration-200"
    >
      {label}
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
          <select className="bg-gray-50 border-r border-gray-300 px-2 py-2.5 text-sm text-gray-700 focus:outline-none">
            <option>NG +234</option>
            <option>US +1</option>
            <option>GB +44</option>
          </select>
          <input
            type="tel"
            placeholder="Phone number"
            value={signupData.phone}
            onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
            className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
          />
        </div>

        {/* Terms */}
        <label className="flex items-center gap-2 text-xs text-gray-500">
          <input type="checkbox" className="accent-blue-600" />
          Agree to our{" "}
          <a href="/terms" className="text-blue-600 underline">Terms</a>
          {" "}and{" "}
          <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a>
        </label>

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
function Step2({ next }: { next: () => void }) {
  const fields = ["First name", "Middle name", "Surname", "Date of Birth (YY/MM/DD)", "Address 1"];
  return (
    <div className="bg-white rounded-2xl shadow-xl flex overflow-hidden w-full max-w-[820px] p-4">
      <div className="hidden sm:block w-[200px] flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STEP1_IMG} alt="" className="w-full h-full rounded-lg" />
      </div>
      <div className="flex-1 p-7 flex flex-col gap-3">
        <div>
          <p className="text-gray-500 text-sm">Kindly fill the form to</p>
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <div className="mt-1 w-10 h-0.5 bg-gray-900" />
        </div>

        {fields.map((f) => (
          <input
            key={f}
            placeholder={f}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}

        <Btn label="Next" onClick={next} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   STEP 3 — Verify email OTP
═══════════════════════════════════════ */
function Step3({ next }: { next: () => void }) {
  const [otp, setOtp] = useState(Array(6).fill(""));

  return (
    <div className="bg-white rounded-2xl shadow-xl flex items-center h-[380px] overflow-hidden w-full max-w-[820px] p-4">
      <div className="hidden sm:block w-[200px] flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STEP3_IMG} alt="" className="w-full h-full rounded-lg" />
      </div>
      <div className="flex-1 p-7 flex flex-col gap-5 text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Verify email</h2>
          <p className="text-gray-500 text-sm mt-1">
            A 6-digit code was sent to your email address.
          </p>
        </div>

        <PinInput value={otp} onChange={setOtp} show={true} />

        <Btn label="Verify email" onClick={next} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   STEP 4 — Create login password (PIN)
═══════════════════════════════════════ */
function Step4({ next }: { next: () => void }) {
  const [pin, setPin]   = useState(Array(6).fill(""));
  const [show, setShow] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-xl flex items-center h-[380px] overflow-hidden w-full max-w-[820px] p-4">
      <div className="hidden sm:block w-[200px] flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STEP4_IMG} alt="" className="w-full h-full rounded-lg" />
      </div>
      <div className="flex-1 p-7 flex flex-col gap-5 text-center">
        <div>
          <p className="text-gray-500 text-sm">Next Step,</p>
          <h2 className="text-2xl font-bold text-gray-900">
            Create your login password
          </h2>
        </div>

        <PinInput value={pin} onChange={setPin} show={show} />

        <button
          onClick={() => setShow((s) => !s)}
          className="text-xs text-gray-500 hover:text-gray-800 self-end -mt-2 transition-colors"
        >
          {show ? "Hide password" : "Show password"}
        </button>

        <Btn label="Continue to create password" onClick={next} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   STEP 5 — Confirm password
═══════════════════════════════════════ */
function Step5({ next }: { next: () => void }) {
  const [pin, setPin]   = useState(Array(6).fill(""));
  const [show, setShow] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-xl flex items-center h-[380px] overflow-hidden w-full max-w-[820px] p-4">
      <div className="hidden sm:block w-[200px] flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STEP4_IMG} alt="" className="w-full h-full rounded-lg" />
      </div>
      <div className="flex-1 p-7 flex flex-col gap-5 text-center">
        <div>
          <p className="text-gray-500 text-sm">Next Step,</p>
          <h2 className="text-2xl font-bold text-gray-900">
            Confirm your password
          </h2>
        </div>

        <PinInput value={pin} onChange={setPin} show={show} />

        <button
          onClick={() => setShow((s) => !s)}
          className="text-xs text-gray-500 hover:text-gray-800 self-end -mt-2 transition-colors"
        >
          {show ? "Hide password" : "Show password"}
        </button>

        <Btn label="Create password" onClick={next} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   STEP 6 — Welcome onboard
═══════════════════════════════════════ */
function Step6({ onSignup, loading, error }: {
  onSignup: () => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl flex items-center h-[380px] overflow-hidden w-full max-w-[820px] p-4 ">
      {/* Emoji panel */}
      <div className="hidden sm:flex items-center justify-center w-[200px] flex-shrink-0 bg-blue rounded-l-2xl">
       <Image src={'/smiley.png'} width={366} height={336} alt="smiley"/>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center text-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Welcome onboard!</h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-[220px]">
          You can set up your transaction pin now by simply proceeding to your
          Profile.
        </p>

        {error && (
          <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-2 w-full">
          <button
            onClick={onSignup}
            disabled={loading}
            className="flex-1 bg-[#2338e0] hover:bg-[#1a2bbf] active:scale-95 text-white font-semibold text-sm py-3 rounded-lg text-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Proceed'}
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            disabled={loading}
            className="flex-1 border border-gray-300 hover:bg-gray-50 active:scale-95 text-gray-700 font-semibold text-sm py-3 rounded-lg text-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip, later
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ROOT — orchestrates all steps
═══════════════════════════════════════ */
export default function SignupPage() {
  const [step, setStep] = useState<Step>(1);
  const [signupData, setSignupData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    pin: ['', '', '', '', '', ''],
    firstName: '',
    lastName: '',
  });
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [signup, { isLoading: apiLoading }] = useSignupMutation();

  const advance = () => setStep((s) => Math.min(s + 1, 6) as Step);

  const handleSignup = async () => {
    if (!signupData.email || !signupData.password || !signupData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    dispatch(signupStart());

    try {
      const result = await signup({
        email: signupData.email,
        password: signupData.password,
        phone: signupData.phone,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
      }).unwrap();

      dispatch(signupSuccess({
        user: result.user,
        token: result.token
      }));

      router.push('/dashboard');
    } catch (error: any) {
      dispatch(signupFailure(error?.data?.message || 'Signup failed. Please try again.'));
    }
  };

  return (
    <PageShell>
      <div className="backdrop-blur-sm bg-white/30 p-6 rounded-lg w-[800px]">

      {step === 1 && <Step1 next={advance} signupData={signupData} setSignupData={setSignupData} />}
      {step === 2 && <Step2 next={advance} />}
      {step === 3 && <Step3 next={advance} />}
      {step === 4 && <Step4 next={advance} />}
      {step === 5 && <Step5 next={advance} />}
      {step === 6 && <Step6 onSignup={handleSignup} loading={loading || apiLoading} error={error} />}
      </div>

    </PageShell>
  );
}