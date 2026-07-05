"use client";

import { useGetUserByIdQuery } from "@/redux/slices/apiSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Image from "next/image";
import { IoMdNotificationsOutline } from "react-icons/io";

export default function DashboardHeaderProfile() {
  // `getCurrentUser` is currently in Redux auth state but not exported yet;
  // we grab the user id from there and enrich via the `/authent/users/{id}/` endpoint.
  const authUser: any = useSelector((state: RootState) => state.auth.user);
  const userId = authUser?.id;

  const { data: profile, isLoading } = useGetUserByIdQuery(userId ?? "", {
    skip: !userId,
  });

  const name = profile?.first_name
    ? `${profile.first_name}${profile.last_name ? " " + profile.last_name : ""}`
    : authUser?.first_name
      ? `${authUser.first_name}${authUser.last_name ? " " + authUser.last_name : ""}`
      : "User";

  const avatar = profile?.avatar || authUser?.avatar || "/profile-img.png";

  if (isLoading) {
    return (
      <div className="flex items-center gap-[8px]">
        <div className="w-[40px] h-[40px] rounded-full bg-gray-200 animate-pulse" />
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-[8px]">
      <div className="relative inline-block">
        <IoMdNotificationsOutline className="w-[32px] h-[32px] text-gray-700" />
        <div
          className="absolute w-[14px] h-[14px] rounded-[355.29px] p-2 gap-[5.65px] top-[-3px] left-[14px] transform rotate-0 bg-orange-500 text-white text-[8px] font-normal flex items-center justify-center"
        >
          20
        </div>
      </div>
      <Image
        src={avatar}
        width={100}
        height={100}
        className="w-[40px] h-[40px] rounded-full cursor-pointer hidden sm:block"
        alt="Profile Image"
        loading="lazy"
      />
      <span className="text-[#181818] font-medium hidden sm:block">{name}</span>
    </div>
  );
}
