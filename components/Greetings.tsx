"use client";

import { useGetUserByIdQuery } from "@/redux/slices/apiSlice";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState } from "@/redux/store";

export default function WelcomeGreeting() {
  const [mounted, setMounted] = useState(false);
  const currentUser: any = useSelector((state: RootState) => state.auth.user);
  const userId = currentUser?.id || "";
  const { data: userData } = useGetUserByIdQuery(userId, { skip: !userId });

  useEffect(() => { setMounted(true); }, []);

  const displayName = currentUser?.first_name || userData?.first_name;

  return (
    <h1 className="text-2xl font-bold text-gray-900 mb-5">
      Welcome{" "}
      <span className="text-[#1E35C8]">
        {mounted && (displayName
          ? `, ${displayName}`
          : currentUser?.email)}
      </span>{" "}
      to Monieplug
    </h1>
  );
}