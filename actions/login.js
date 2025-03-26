"use server";

import { signIn } from "@/auth";
import { createSession, deleteSession } from "@/lib/session";
import { signInSchema } from "@/lib/zod";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import axios from "axios";
import { AuthError } from "next-auth";
import { redirect, RedirectType } from "next/navigation";

export const login = async (values) => {
  const validateFields = signInSchema.safeParse(values);

  if (!validateFields.success) {
    return {
      zodError: JSON.parse(validateFields.error.message)
        .map((e) => e.message)
        .join("\n"),
    };
  }
  try {
    const res = await axios.post(`${BACKEND_API_ROUTE}/teams/auth/login`, {
      password: values?.password,
      email: values?.email,
    });
    const user = await res.data;
    if (res.status === 200) {
      await createSession(user?._id, user?.access_token);
    }
  } catch (error) {
    // console.log(error.response.data);
    return { error: error?.response?.data?.error };
  }
  redirect("/", RedirectType.push);
};

export async function logout() {
  await deleteSession();
  redirect("/auth/login");
}
