"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import routes from "@/helpers/routes";
import LoginPage from "./login/page";

const Homepage = async () => {
  const session = await getSession();
  if (!session) {
    redirect(routes.login());
  }

  return (
    <>
      <LoginPage />
    </>
  );
};

export default Homepage;
