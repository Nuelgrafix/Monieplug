import { Suspense } from "react";
import SignInFormClient from "./SignInFormClient";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#1E35C8] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInFormClient />
    </Suspense>
  );
}
