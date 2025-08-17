"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { BiSearch } from 'react-icons/bi';
import { IoMdNotificationsOutline } from "react-icons/io";
import logout from "@/app/(auth)/actions/logout.action";
import styles from "./header.module.css";
import DropdownMenu, {
  DropdownItem,
} from "../dropdown-menu/dropdown-menu.component";
import routes from "@/helpers/routes";
import NotificationComponent from "./notification.component";
import FilterSearch from "@/components/filter-search/filter-search.component";

const Header = () => {
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const pathname = usePathname();

  const toggleNotification = () => setIsOpenNotification((prev) => !prev);

  const closeNotification = () => setIsOpenNotification(false);

  return (
    <header className='flex justify-between items-center mb-8 w-full'>
      {/* Welcome Message / Dashboard Title */}
      <div className="hidden sm:block">
        <h1 className='text-[32px] font-bold text-[#5075FF]'>Dashboard</h1>
      </div>

      {/* Search Bar */}
      <div className="hidden sm:block w-full max-w-[493px]">
        <div className='relative'>
          <BiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input 
            type="text" 
            placeholder="Search event"
            className='pl-10 pr-4 py-[10px] text-[#667085] px-[14px] w-full h-[44px] border border-[#D0D5DD] rounded-[8px] bg-white focus:outline-none focus:border-[#1843E2]'
          />
        </div>
      </div>

      {/* Icons and Dropdowns */}
      <div className='flex items-center gap-[8px] w-full sm:w-auto justify-end sm:justify-start'>
        {/* Notification Bell */}
        <div className="relative">
          <button onClick={toggleNotification} className="relative inline-block">
            <IoMdNotificationsOutline className='w-[32px] h-[32px] text-gray-700' />
            <div className="absolute w-[14px] h-[14px] rounded-[355.29px] p-2 gap-[5.65px] top-[-3px] left-[14px] transform rotate-0 bg-orange-500 text-white text-[8px] font-normal flex items-center justify-center">
              2
            </div>
          </button>

          {/* Notification Dropdown */}
          <NotificationComponent
            isOpenNotification={isOpenNotification}
            closeNotification={closeNotification}
          />
        </div>

        {/* User Profile Dropdown */}
        <DropdownMenu
          trigger={
            <div className="flex items-center gap-[8px]">
              <Image
                src="/image/generated-image.png"
                width={40}
                height={40}
                className='w-[40px] h-[40px] rounded-full cursor-pointer'
                alt='Profile Image'
                loading='lazy'
              />
              <div className="hidden sm:block">
                <span className='text-[#181818] font-medium text-[16px]'>Emmanuel</span>
              </div>
              <div className="sm:hidden block">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[16px] text-[#181818] font-medium">Hi Emmanuel</p>
                  <h4 className="text-[14px] text-[#181818]">Welcome to Monieplug</h4>
                </div>
              </div>
            </div>
          }
        >
          <div className={styles.profileContainer}>
            {/* User Info */}
            <DropdownItem asChild disabled>
              <div className={styles.avatarAndDetails}>
                <div className="relative w-[40px] h-[40px]">
                  <Image
                    src="/profile-img.png"
                    alt="User Avatar"
                    fill
                    sizes="100%"
                    className="rounded-full"
                  />
                  <div className={styles.online} />
                </div>

                <div className={styles.details}>
                  <span className="font-medium text-[14px] leading-[20px] text-[#344054]">
                    Emmanuel Olivia
                  </span>
                  <p className="text-[12px] leading-[18px] text-[#667085]">
                    emmanuel@monieplug.com
                  </p>
                </div>
              </div>
            </DropdownItem>

            {/* Dropdown Options */}
            <div className="flex flex-col">
              <DropdownItem asChild>
                <Link href={routes.profile()}>
                  <span className={styles.listItem}>View Profile</span>
                </Link>
              </DropdownItem>

              <DropdownItem asChild>
                <Link href={routes.settings()}>
                  <span className={styles.listItem}>Settings</span>
                </Link>
              </DropdownItem>

              <DropdownItem asChild>
                <Link href={routes.support()}>
                  <span className={styles.listItem}>Support</span>
                </Link>
              </DropdownItem>

              <DropdownItem asChild>
                <Link href={routes.login()}>
                  <span>
                    <button onClick={() => logout()}>
                      <span className={styles.listItem}>Log out</span>
                    </button>
                  </span>
                </Link>
              </DropdownItem>
            </div>
          </div>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;