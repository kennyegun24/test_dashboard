import { AuthError, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import axios from "axios";

const BACKEND_API_ROUTE = process.env.BACKEND_API_ROUTE;
export default {
  pages: {
    signIn: "/login",
    // newUser: "/register",
    error: "/login",
  },
  // trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = signInSchema.safeParse(credentials);
        console.log(validatedFields);
        if (validatedFields.success) {
          try {
            const res = await axios.post(
              `${BACKEND_API_ROUTE}/teams/auth/login`,
              {
                // method: "POST",
                // body: JSON.stringify({
                password: credentials?.password,
                email: credentials?.email,
                // }),
                // headers: { "Content-Type": "application/json" },
              }
            );

            const user = await res.data;
            if (res.status === 200) {
              return user;
            }
          } catch (error) {
            console.log(error);
          }

          // if (res.ok && user) {
          //   return user;
          // } else {
          //   const errorMessage = user?.error || "Unknown error occurred.";
          //   // throw new Error(errorMessage);
          //   console.log(user?.error);
          // }
        } else {
          throw new Error("Invalid input. Please check your credentials.");
        }
      },
    }),
    Credentials({
      id: "signUp",
      name: "Sign Up",
      async authorize(credentials) {
        const validatedFields = signInSchema.safeParse(credentials);
        if (validatedFields.success) {
          const res = await fetch(`${BACKEND_API_ROUTE}/user/register`, {
            method: "POST",
            body: JSON.stringify({
              password: credentials?.password,
              email: credentials?.email,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const user = await res.json();
          if (res.ok && user) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
};
