"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { typeToFlattenedError, z } from "zod";

import routes from "@/helpers/routes";
import { getAbsoluteUrl, post } from "@/helpers/api";

import { encrypt } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email({ message: "Email is invalid" }),
  password: z
    .string()
    .min(8, { message: "Password must contain 8 or more characters" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export type InitialState = {
  errors?: typeToFlattenedError<LoginSchema, string>["fieldErrors"];
  message?: string;
};

const login = async (_: InitialState, formData: FormData) => {
  const fields = Object.fromEntries(formData.entries());

  const result = loginSchema.safeParse(fields);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let res: Response;

  try {
    res = await post(
      getAbsoluteUrl({ service: "user", path: "/agent/auth/login" }),
      {
        body: JSON.stringify(result.data),
      }
    );
  } catch (e: unknown) {
    return { message: (e as { message: string }).message };
  }

  const data = await res.json();

  if (res.ok) {
    const user = data?.data;

    // Date.now + 60 minutes in milliseconds
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const session = await encrypt({ user, expiresAt });

    (await cookies()).set("session", session, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    redirect(routes.home());
  } else {
    return {
      message: (data?.error?.[0] ||
        data?.message ||
        "Something went wrong") as string,
    };
  }
};

export default login;
