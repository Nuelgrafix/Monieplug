"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { typeToFlattenedError, z } from "zod";

import routes from "@/helpers/routes";
import { getAbsoluteUrl, post } from "@/helpers/api";

import { encrypt } from "@/lib/auth";

const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(100, { message: "Full name must be less than 100 characters" }),
  email: z.string().email({ message: "Email is invalid" }),
  password: z
    .string()
    .min(8, { message: "Password must contain 8 or more characters" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Confirm password must contain 8 or more characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupSchema = z.infer<typeof signupSchema>;

export type InitialState = {
  errors?: typeToFlattenedError<SignupSchema, string>["fieldErrors"];
  message?: string;
};

const signup = async (_: InitialState, formData: FormData) => {
  const fields = Object.fromEntries(formData.entries());

  const result = signupSchema.safeParse(fields);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  // Remove confirmPassword from the data sent to the API
  const { confirmPassword, ...signupData } = result.data;

  let res: Response;

  try {
    res = await post(
      getAbsoluteUrl({ service: "user", path: "/agent/auth/register" }),
      {
        body: JSON.stringify(signupData),
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

export default signup;