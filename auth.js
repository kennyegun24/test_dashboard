import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { signout } from "./actions/signout";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      console.log(session, "check");
      if (token?.expiresIn > Math.floor(Date.now())) {
        console.log(token?.expiresIn, "exps");
        session.user.expiresIn = token?.expiresIn;
        session.expires = token?.expiresIn;
        session.user._id = token?._id;
        session.user.access_token = token?.access_token;
        return session;
      }
      try {
        // await signout();
        console.log("ajhsjah");
        return null;
      } catch (error) {
        console.log("signout error in session");
      }
      return null;
    },
    async jwt({ token, user, trigger, session }) {
      console.log(token, "user");
      if (user) {
        token.expiresIn = user?.expiresIn;
        token._id = user?._id;
        token.exp = user?.expiresIn;
        token.access_token = user?.access_token;
        return token;
      }
      // try {
      //   // await signout();
      //   return null;
      // } catch (error) {
      //   console.log("signout error in jwt");
      // }
      // return null;
    },
  },
  ...authConfig,
});
