/**
 * API endpoints responsible for authentication purposes
 * These should always be open for public auth
 */
export const authApiPrefixes = [
  "/api/user",
  "/api/auth",
  "/api",
  "/api/teams/auth/login",
];

/**
 * Authentication routes for user authentication.
 * These should always be open
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forget_password",
];

/**
 * DEFAULT REDIRECT AFTER SUCCESSFUL LOGIN OR SIGNUP
 */
export const DEFAULT_LOGIN_REDIRECT = "/";

/**
 * PUBLIC ROUTES
 */

export const publicRoutes = ["/auth/verify_email", "/api/teams/auth/login"];
