
import AdminLayout from "@/components//AdminLayout";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import PageLoader from "@/components/PageLoader";
import DashboardTitle from "@/components/DashboardTitle";
import AdminMobileDrawerWrapper from "@/components/AdminMobileDrawerWrapper";
import DashboardHeaderProfile from "@/components/DashboardHeaderProfile";
import SearchBar from "@/components/SearchBar";

export const revalidate = 3600;

async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <AdminLayout>
          <div className=' min-h-screen p-4 md:p-6'>
            {/* responsive top bar for mobile */}
            <AdminMobileDrawerWrapper />

            {/* Desktop / Tablet header */}
            <div className='hidden lg:flex justify-between items-center mb-8'>
              <DashboardTitle />

              {/* Search Bar */}
              <SearchBar />

                {/* Profile — now data-driven */}
                <DashboardHeaderProfile />
            </div>
            {children}
          </div>
        </AdminLayout>
      </Suspense>
    </>
  );
}

export default Layout;

