"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa6";
import styles from "./header.module.css";
import Button from "../../hooks/buttonSizes/Button";
import Link from "next/link";
import routes from "@/helpers/routes";

interface NotificationComponentProps {
  isOpenNotification: boolean;
  closeNotification: () => void;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({
  isOpenNotification,
  closeNotification,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeNotification();
      }
    };

    if (isOpenNotification) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpenNotification, closeNotification]);

  if (!isOpenNotification) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.notificationContainer} ref={containerRef}>
        {/* Header Section */}
        <div className="flex justify-between items-center w-full p-4 ">
          <h3 className="text-lg font-semibold text-[#101828]">
            Notifications
          </h3>
          <AiOutlineClose
            onClick={closeNotification}
            size={20}
            className="text-[#667085] cursor-pointer"
          />
        </div>
        {/* Notification Content */}
        <div className="flex flex-col max-h-[440px] w-full overflow-auto overflow-x-hidden scroll-py-5 scrollbar-none ">
          {/*  Content */}
          <div className={styles.notificationavatarAndDetails}>
            <div className="flex gap-[12px]">
              {/* User Avatar */}
              <div className={styles.avatar}>
                <Image
                  src="/icons/user_1.png"
                  alt="User Avatar"
                  fill
                  sizes="100%"
                  className="rounded-full object-cover"
                />
                <div className={styles.online} />
              </div>

              {/* User Details */}
              <div className="flex flex-col gap-2 justify-center items-start ">
                <div className="flex gap-[8px] items-center w-full">
                  <span className={styles.notificationName}>
                    Balogun Agbeyawo
                  </span>
                  <p className="text-xs text-[#667085]">Just now</p>
                </div>
                <p className="text-sm text-[#667085]">
                  Invited&nbsp;
                  <span className="text-[#1261B2] font-medium">
                    Alisa Hester
                  </span>
                  &nbsp;to the team
                </p>
              </div>
            </div>
            <div className={styles.onlineNoitfication} />
          </div>
          <div className={styles.notificationavatarAndDetails}>
            <div className="flex gap-[12px]">
              {/* User Avatar */}
              <div className={styles.avatar}>
                <Image
                  src="/icons/user_1.png"
                  alt="User Avatar"
                  fill
                  sizes="100%"
                  className="rounded-full object-cover"
                />
                <div className={styles.online} />
              </div>

              {/* User Details */}
              <div className="flex flex-col gap-2 justify-center items-start ">
                <div className="flex gap-[8px] items-center w-full">
                  <span className={styles.notificationName}>
                    Balogun Agbeyawo
                  </span>
                  <p className="text-xs text-[#667085]">Just now</p>
                </div>
                <p className="text-sm text-[#667085]">
                  Invited&nbsp;
                  <span className="text-[#1261B2] font-medium">
                    Alisa Hester
                  </span>
                  &nbsp;to the team
                </p>
              </div>
            </div>
            <div className={styles.onlineNoitfication} />
          </div>
        </div>
        {/* route Link */}
        <div className="flex justify-end w-full">
          <Link href={routes.notification()} onClick={closeNotification}>
            <div className="w-full max-w-[78px]">
              <Button size="arrowRight">
                <span>View All</span> <FaArrowRight className="text-[12px]" />
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationComponent;
