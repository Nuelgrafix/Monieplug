import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Sidebar from "@/components/sidebar/sidebar.component";
import Header from "@/components/header/header.component";
// import { getSession } from "@/lib/auth";
import routes from "@/helpers/routes";
import Footer from "@/components/footer/footer_bar.component";

interface IDashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = async ({ children }: IDashboardLayoutProps) => {
  // const session = await getSession();
  // if (!session) {
  //   redirect(routes.login());
  // }

  return (
    <div className="relative w-full flex bg-white md:bg-[#F8F8F8]">
      {/* Sidebar Section */}
      <div className="hidden md:block md:w-[226px] flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Section */}
      <div className="w-full md:max-w-[1157px] flex-1 flex flex-col">
        {/* Header */}
        <div className="px-3 py-4 lg:px-6 lg:py-6">
          <Header />
        </div>

        {/* Main Content */}
        <div className="flex-1 px-3 lg:px-6">
          
            <div className="w-full">
              {children}
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 lg:px-6">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;