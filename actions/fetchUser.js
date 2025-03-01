"use server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export const fetchUser = async () => {
  try {
    const cookie = cookies().get("session")?.value;
    const user = await decrypt(cookie);
    return user;
  } catch (error) {}
};
