"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
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
    <header className={styles.header}>
      {/* Welcome Message */}
      <div className="hidden sm:block">
        <h3 className="flex text-[#5075FF] lg:text-[32px] leading-[48px]">
          Dashboard
        </h3>
      </div>

      <div className="hidden sm:block w-full  max-w-[493px]">
        <FilterSearch placeholder="Search event" />
      </div>

      {/* Icons and Dropdowns */}
      <div className={clsx(styles.icons,"flex-row-reverse sm:flex-row w-full sm:w-auto")}>
        {/* Notification Bell */}
        <div>
          <button className={styles.bellContainer} onClick={toggleNotification}>
            <Image
              width={16.91}
              height={18.79}
              src="/icons/bell-Icon.png"
              alt="Notification Bell"
            />
            <div className={styles.countContainer}>
              <p>2</p>
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
            <div className="flex space-x-3.5 justify-center items-center">
              <button className={styles.avatar}>
                <Image
                  src="/icons/user_1.png"
                  alt="User Avatar"
                  fill
                  sizes="100%"
                />
              </button>
              <p className="hidden sm:block text-[16px] text-[#181818]">
                Emmanuel
              </p>
              <div className="sm:hidden block gap-0.5 flex-col justify-start">
                <p className="text-[16px] text-[#181818]">Hi Emmanuel</p>
                <h4 className="text-[16px] text-[#181818]">
                  Welcome to Monieplug
                </h4>
              </div>
            </div>
          }
        >
          <div className={styles.profileContainer}>
            {/* User Info */}
            <DropdownItem asChild disabled>
              <div className={styles.avatarAndDetails}>
                <div className={styles.avatar}>
                  <Image
                    src="/icons/user_1.png"
                    alt="User Avatar"
                    fill
                    sizes="100%"
                  />
                  <div className={styles.online} />
                </div>

                <div className={styles.details}>
                  <span className="font-medium text-[14px] leading-[20px] text-[#344054]">
                    Olivia Rhye
                  </span>
                  <p className="text-[8px] leading-[18px] text-[#667085]">
                    olivia@untitledui.com
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
