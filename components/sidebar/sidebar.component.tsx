"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import routes from "@/helpers/routes";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css";
import SvgIcon from "../svg-icon/svg-icon.component";
import logout from "@/app/(auth)/actions/logout.action";

interface DropdownState {
  isOpen: boolean;
  isHovered: boolean;
}

interface DropdownsState {
  [key: string]: DropdownState;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className={clsx(styles.sidebar)}>
      <div className="px-[17px]">
        <div className="max-w-[117.3px] h-auto object-cover duration-300 ease-in-out">
          <Image
            width={117.3}
            height={35}
            className="w-full h-auto object-cover"
            src="/logo/logo.png"
            alt="Finchglow travels"
          />
        </div>
      </div>
      <div
        className={clsx(
          styles.noscrollbar,
          "flex flex-col items-center w-full overflow-auto overflow-x-hidden "
        )}
      >
        {/* Sidebar Navigation */}
        <nav className={styles.nav}>
          <ul className="flex gap-[8px] flex-col items-start w-full px-[17px]">
            {/* Create event */}
            <li
              className={clsx(
                "hover:bg-[#7B97FF] bg-[#F58220] flex w-full h-auto p-[1rem] capitalize rounded-[6px] duration-100"
              )}
            >
              <Link
                href={routes.home()}
                className={clsx("flex gap-4 justify-start items-center w-full")}
              >
                <span className={clsx("font-medium !text-white text-[14px]")}>
                  Create event
                </span>
              </Link>
            </li>
            {/*  home */}
            <li
              className={clsx(
                styles.NavLink,
                pathname === routes.home() && styles.activeNavLink,
                "group"
              )}
            >
              <Link
                href={routes.home()}
                className={clsx(
                  pathname === routes.home() && styles.activeNavLinkText,
                  "group-hover:!text-white w-full"
                )}
              >
                home
              </Link>
            </li>
            {/* events */}
            <li
              className={clsx(
                styles.NavLink,
                pathname === routes.events() && styles.activeNavLink,
                "group"
              )}
            >
              <Link
                href={routes.events()}
                className={clsx(
                  pathname === routes.events() && styles.activeNavLinkText,
                  "group-hover:!text-white w-full"
                )}
              >
                Events
              </Link>
            </li>
            {/*     Scan2Pay */}
            <li
              className={clsx(
                styles.NavLink,
                pathname === routes.scan2pay() && styles.activeNavLink,
                "group"
              )}
            >
              <Link
                href={routes.scan2pay()}
                className={clsx(
                  pathname === routes.scan2pay() && styles.activeNavLinkText,
                  "group-hover:!text-white w-full"
                )}
              >
                Scan2Pay
              </Link>
            </li>
            {/* Profile */}
            <li
              className={clsx(
                styles.NavLink,
                pathname === routes.profile() && styles.activeNavLink,
                "group"
              )}
            >
              <Link
                href={routes.profile()}
                className={clsx(
                  pathname === routes.profile() && styles.activeNavLinkText,
                  "group-hover:!text-white w-full"
                )}
              >
                Profile
              </Link>
            </li>
          </ul>
          <div className="flex gap-[12px] flex-col justify-center items-center pt-[100px] pb-[32px] w-full ">
            <hr className="h-[2px] bg-white w-full" />
            <ul className="flex gap-[12px] flex-col justify-center px-[17px] items-center  w-full ">
              {/* Dropdown 10 */}
              <li className={clsx("bg-[#7B97FF] group", styles.rootNavLink)}>
                <button
                  onClick={() => logout()}
                  className={clsx(
                    "flex gap-4 justify-start items-center w-full cursor-pointer"
                  )}
                >
                  <Image
                    src="/icons/Icon.png"
                    width={20}
                    height={20}
                    className={clsx("object-cover")}
                    alt="icon"
                  />
                  <p className="group-hover:text-white text-[#282828]">
                    Log out
                  </p>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
