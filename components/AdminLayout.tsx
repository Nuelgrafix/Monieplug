// The RootLayout component
"use client";
import AdminDashboardNav, {
  AdminMobileNav,
} from "@/components/adminComponents/adminDashboardNav";
import { AdminNavLinks } from "@/data/NavLinks";
import AdminSidebar from "@/components/adminComponents/AdminSidebar";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosMenu } from "react-icons/io";
import React, { useRef, useState } from "react";
import AdminMobileDrawer from "@/components/Header/AdminMobileDrawer";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { logout as logoutAction } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/signin");
  };

  return (
    <>
      {/* <div className="grid grid-cols-1 sm:grid-cols-12 gap-12">
        <div
          className={` md:hidden flex justify-between items-center mb-[-5rem]`}
        >
          <div>
            <AdminMobileNav />
          </div>

          <div className="flex xl:hidden">
            <button
              ref={btnRef}
              onClick={() => setOpen(true)}
              className="bg-transparent"
            >
              {open ? (
                <AiOutlineClose size="1.5rem" onClick={() => setOpen(false)} />
              ) : (
                <IoIosMenu size="2rem" />
              )}
            </button>
          </div>
        </div>

        <AdminMobileDrawer
          isOpen={open}
          handleLogout={handleLogout}
          onClose={() => setOpen(false)}
        /> */}

        <div className="sm:col-span-2 w-[300px] hidden sm:block fixed h-[100vh] border-r-[#eee] border-r">
          <AdminSidebar
            AdminNavLinks={AdminNavLinks}
            handleLogout={handleLogout}
          />
        </div>
        <div className="sm:col-span-12 mx-4 sm:ml-[300px]">{children}</div>
      {/* </div> */}
    </>
  );
}
