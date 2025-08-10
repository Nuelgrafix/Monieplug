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
    <div className={clsx(styles.footer)}>
      <nav className={styles.nav}>
        <ul className=" flex justify-between items-start w-full ">
          {/* Example Item */}
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
                "flex flex-col justify-center items-center gap-2 group p-3"
              )}
            >
              <SvgIcon
                className={clsx(
                  pathname === routes.home() && styles.icon,
                  "!w-[24px] !h-[24px] text-[#565656] group-hover:!text-white"
                )}
                iconName="RiHome5Line"
              />

              <span
                className={clsx(
                  pathname === routes.home() && styles.activeNavLinkText,
                  "group-hover:!text-white"
                )}
              >
                home
              </span>
            </Link>
          </li>

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
                "flex flex-col justify-center items-center gap-2 group p-3"
              )}
            >
              <SvgIcon
                className={clsx(
                  pathname === routes.events() && styles.icon,
                  "!w-[24px] !h-[24px] text-[#565656] group-hover:!text-white"
                )}
                iconName="TbCalendarStar" 
              />

              <span
                className={clsx(
                  pathname === routes.events() && styles.activeNavLinkText,
                  "group-hover:!text-white"
                )}
              >
                events
              </span>
            </Link>
          </li>

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
                "flex flex-col justify-center items-center gap-2 group p-3"
              )}
            >
              <SvgIcon
                className={clsx(
                  pathname === routes.scan2pay() && styles.icon,
                  "!w-[24px] !h-[24px] text-[#565656] group-hover:!text-white"
                )}
                iconName="BsQrCodeScan"
              />

              <span
                className={clsx(
                  pathname === routes.scan2pay() && styles.activeNavLinkText,
                  "group-hover:!text-white"
                )}
              >
                Scan2Pay
              </span>
            </Link>
          </li>

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
                "flex flex-col justify-center items-center gap-2 group p-3"
              )}
            >
              <SvgIcon
                className={clsx(
                  pathname === routes.profile() && styles.icon,
                  "!w-[24px] !h-[24px] text-[#565656] group-hover:!text-white"
                )}
                iconName="TbUserHexagon"
              />

              <span
                className={clsx(
                  pathname === routes.profile() && styles.activeNavLinkText,
                  "group-hover:!text-white"
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
