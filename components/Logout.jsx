"use client"; // Ensure this runs on the client side
import React from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { signOut } from "next-auth/react"; // Correct import for client-side
import { logout } from "@/actions/login";

export const signout = async () => {
  try {
    console.log("Logging out...");
    await signOut({ callbackUrl: "/auth/login" }); // Redirects user after logout
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

const Logout = () => {
  return (
    <DropdownMenuItem onClick={() => logout()}>
      <span>Sign out</span>
    </DropdownMenuItem>
  );
};

export default Logout;
