// import { NextResponse } from "next/server";
// import {
//   authApiPrefixes,
//   authRoutes,
//   DEFAULT_LOGIN_REDIRECT,
//   publicRoutes,
// } from "./routes";
// import NextAuth from "next-auth";
// import authConfig from "./auth.config";
// import { cookies } from "next/headers";
// import { decrypt } from "./lib/session";

// export const middleware = async (req) => {
//   // const res = NextResponse.next();
//   // res.headers.append("Access-Control-Allow-Credentials", "true");
//   // res.headers.append("Access-Control-Allow-Origin", "*");
//   // res.headers.append(
//   //   "Access-Control-Allow-Methods",
//   //   "GET,DELETE,PATCH,POST,PUT"
//   // );
//   // res.headers.append(
//   //   "Access-Control-Allow-Headers",
//   //   "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MDS, Content-Type, Date, X-Api-Version"
//   // );

//   const path = req.nextUrl.pathname;
//   const isPublicRoute = publicRoutes.includes(path);
//   console.log("first");
//   const cookie = cookies().get("session")?.value;

//   const session = await decrypt(cookie);

//   if (!isPublicRoute && !session?.userId) {
//     console.log("not auth");
//     return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
//   }

//   // if (isPublicRoute && session?.userId) {
//   //   return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
//   // }

//   // return res; // Allow navigation if all conditions pass
// };

// // const { auth } = NextAuth(authConfig);

// // export default auth((req) => {
// //   const { auth, nextUrl } = req;
// //   // console.log(auth, "log");
// //   const { pathname } = nextUrl;
// //   // console.log(pathname);
// //   const isLoggedIn = !!auth;
// //   // console.log(isLoggedIn);
// //   const isApiAuthRoute = authApiPrefixes.some((route) =>
// //     pathname.startsWith(route)
// //   );

// //   const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
// //   const isPublicRoute = publicRoutes.includes(pathname);

// //   if (isApiAuthRoute) {
// //     return null;
// //   }

// //   if (isAuthRoute) {
// //     if (isLoggedIn) {
// //       return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
// //     }
// //     return null;
// //   }

// //   if (!isLoggedIn && !isPublicRoute) {
// //     return Response.redirect(new URL("/auth/login", nextUrl));
// //   }
// // });

// // export const config = {
// //   matcher: [
// //     // "/api/:path*",
// //     "/((?!.+\\.[\\w]+$|_next).*)",
// //     "/",
// //     "/(api|trpc)(.*)",
// //   ],
// // };
// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = ["/dashboard", "/"];
const publicRoutes = ["/auth/login"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  if (
    path.startsWith("/_next") ||
    path.startsWith("/static") ||
    path.endsWith(".ico") ||
    path.endsWith(".png") ||
    path.startsWith("/api")
  ) {
    return NextResponse.next();
  }
  console.log(path);
  const res = NextResponse.next();
  res.headers.append("Access-Control-Allow-Credentials", "true");
  res.headers.append("Access-Control-Allow-Origin", "*");
  res.headers.append(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT"
  );
  res.headers.append(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MDS, Content-Type, Date, X-Api-Version"
  );
  const isProtectedRoute = protectedRoutes.includes(path);
  console.log(isProtectedRoute, path);
  const isPublicRoute = publicRoutes.includes(path);

  // Get session cookie
  const cookie = cookies().get("session")?.value;
  // console.log(cookie, "cookies");

  // If there's no cookie and the route is protected, redirect to login
  if (!cookie && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  if (!cookie) {
    return res; // Allow access to public routes
  }

  const session = await decrypt(cookie);
  console.log(session.userId);
  // If user is authenticated and trying to access a public route (like login) → Redirect to dashboard
  if (isPublicRoute && session?.userId) {
    console.log("second");
    res;
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // If user is not authenticated and trying to access a protected route → Redirect to login
  if (isProtectedRoute && !session?.userId) {
    console.log("first");
    res;
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  // return NextResponse.next(); // Allow the request if no redirects are needed
  return res;
}
// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };
// export const config = {
//   matcher: [
//     "/((?!.+\\.[\\w]+$|_next|api).*)", // Excludes all /api routes
//     "/",
//   ],
// };
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// import { decrypt } from "./lib/session";

// const protectedRoutes = ["/dashboard", "/management"];
// const publicRoutes = [
//   "/auth/login",
//   "/api/teams/auth/login",
//   "/api/teams/auth/register",
// ];

// export default async function middleware(req) {
//   const path = req.nextUrl.pathname;

//   if (req.method === "OPTIONS") {
//     return new NextResponse(null, {
//       status: 204,
//       headers: {
//         "Access-Control-Allow-Credentials": "true",
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT,OPTIONS",
//         "Access-Control-Allow-Headers":
//           "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MDS, Content-Type, Date, X-Api-Version",
//       },
//     });
//   }

//   if (
//     path.startsWith("/_next") ||
//     path.startsWith("/static") ||
//     path.endsWith(".ico") ||
//     path.endsWith(".png")
//   ) {
//     return NextResponse.next();
//   }
//   const res = NextResponse.next();
//   res.headers.append("Access-Control-Allow-Credentials", "true");
//   res.headers.append("Access-Control-Allow-Origin", "*");
//   res.headers.append(
//     "Access-Control-Allow-Methods",
//     "GET,DELETE,PATCH,POST,PUT,OPTIONS"
//   );
//   res.headers.append(
//     "Access-Control-Allow-Headers",
//     "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MDS, Content-Type, Date, X-Api-Version"
//   );

//   const isProtectedRoute =
//     path === "/" ||
//     protectedRoutes.some(
//       (route) => path === route || path.startsWith(route + "/")
//     );

//   console.log(isProtectedRoute, path);
//   // console.log(_isProtectedRoute);
//   const isPublicRoute = publicRoutes.includes(path);

//   // Get session cookie
//   const cookie = cookies().get("session")?.value;
//   // console.log(cookie, "cookies");

//   // If there's no cookie and the route is protected, redirect to login
//   if (!cookie && isProtectedRoute && !path.startsWith("/api/")) {
//     return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
//   }

//   if (!cookie) {
//     return res; // Allow access to public routes
//   }

//   const session = await decrypt(cookie);
//   // If user is authenticated and trying to access a public route (like login) → Redirect to dashboard
//   if (isPublicRoute && session?.userId) {
//     console.log("second");
//     res;
//     return NextResponse.redirect(new URL("/", req.nextUrl));
//   }

//   // If user is not authenticated and trying to access a protected route → Redirect to login
//   if (isProtectedRoute && !session?.userId) {
//     console.log("first");
//     res;
//     return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
//   }

//   // return NextResponse.next(); // Allow the request if no redirects are needed
//   return res;
// }
