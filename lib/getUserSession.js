"use server";
import { auth } from "@/auth";

export const getUserSession = async () => {
  const session = await auth();
  console.log(session, "session");
  return session;
};
