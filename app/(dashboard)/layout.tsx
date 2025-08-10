import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Sidebar from "@/components/sidebar/sidebar.component";
import Header from "@/components/header/header.component";

import { getSession } from "@/lib/auth";
import routes from "@/helpers/routes";
import Footer from "@/components/footer/footer_bar.component";

interface IDashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = async ({ children }: IDashboardLayoutProps) => {
  const session = await getSession();

  if (!session) {
    redirect(routes.login());
  }

  return (
    <>
      <div className="flex justify-center items-center w-full h-screen overflow-hidden">
        <Sidebar />

        <aside className="w-full bg-[#f5faff]">
          <Header />
          <div className="window-inner">
            <div className="siteWapper h-screen w-full">{children}</div>
          </div>
          <Footer />
        </aside>
      </div>
    </>
  );
};

export default DashboardLayout;