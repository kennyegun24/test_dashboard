import { signOut } from "@/auth";

export const signout = async () => {
  try {
    console.log("first");
    await signOut();
  } catch (error) {
    console.log(error);
    console.log("error logging out");
  }
};
