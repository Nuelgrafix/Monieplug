"use client";

import { usePathname } from "next/navigation";
import routes from "@/helpers/routes";
import clsx from "clsx";
import Link from "next/link";
import styles from "./footer.module.css";
import SvgIcon from "../svg-icon/svg-icon.component";

const Footer: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className={clsx(styles.footer, "md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2")}>
      <nav className={styles.nav}>
        <ul className="flex justify-between items-center w-full">
          {/* Home */}
          <li
            className={clsx(
              styles.NavLink,
              pathname === routes.home() && styles.activeNavLink,
              "group flex-1"
            )}
          >
            <Link
              href={routes.home()}
              className={clsx(
                "flex flex-col justify-center items-center gap-1 group p-2"
              )}
            >
              <SvgIcon
                className={clsx(
                  pathname === routes.home() && styles.icon,
                  "!w-[20px] !h-[20px] text-[#565656] group-hover:!text-white"
                )}
                iconName="RiHome5Line"
              />

              <span
                className={clsx(
                  pathname === routes.home() && styles.activeNavLinkText,
                  "group-hover:!text-white text-xs"
                )}
              >
                Home
              </span>
            </Link>
          </li>

          {/* Events */}
          <li
            className={clsx(
              styles.NavLink,
              pathname === routes.events() && styles.activeNavLink,
              "group flex-1"
            )}
          >
            <Link
              href={routes.events()}
              className={clsx(
                "flex flex-col justify-center items-center gap-1 group p-2"
              )}
            >
              <SvgIcon
                className={clsx(
                  pathname === routes.events() && styles.icon,
                  "!w-[20px] !h-[20px] text-[#565656] group-hover:!text-white"
                )}
                iconName="TbCalendarStar" 
              />

              <span
                className={clsx(
                  pathname === routes.events() && styles.activeNavLinkText,
                  "group-hover:!text-white text-xs"
                )}
              >
                Events
              </span>
            </Link>
          </li>

          {/* Scan2Pay */}
          <li
            className={clsx(
              styles.NavLink,
              pathname === routes.scan2pay() && styles.activeNavLink,
              "group flex-1"
            )}
          >
            <Link
              href={routes.scan2pay()}
              className={clsx(
                "flex flex-col justify-center items-center gap-1 group p-2"
              )}
            >
              <SvgIcon
                className={clsx(
                  pathname === routes.scan2pay() && styles.icon,
                  "!w-[20px] !h-[20px] text-[#565656] group-hover:!text-white"
                )}
                iconName="BsQrCodeScan"
              />

              <span
                className={clsx(
                  pathname === routes.scan2pay() && styles.activeNavLinkText,
                  "group-hover:!text-white text-xs"
                )}
              >
                Scan
              </span>
            </Link>
          </li>

          {/* Profile */}
          <li
            className={clsx(
              styles.NavLink,
              pathname === routes.profile() && styles.activeNavLink,
              "group flex-1"
            )}
          >
            <Link
              href={routes.profile()}
              className={clsx(
                "flex flex-col justify-center items-center gap-1 group p-2"
              )}
            >
              <SvgIcon
                className={clsx(
                  pathname === routes.profile() && styles.icon,
                  "!w-[20px] !h-[20px] text-[#565656] group-hover:!text-white"
                )}
                iconName="TbUserHexagon"
              />

              <span
                className={clsx(
                  pathname === routes.profile() && styles.activeNavLinkText,
                  "group-hover:!text-white text-xs"
                )}
              >
                Profile
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Footer;