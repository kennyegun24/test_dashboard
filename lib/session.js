import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.NEXTAUTH_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId, token) {
  console.log(userId);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  // const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
  const session = await encrypt({ userId, token, expiresAt });
  // console.log(session);
  cookies().set("session", session, {
    httpOnly: true,
    // secure: true,
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSession() {
  cookies().delete("session");
}

// type SessionPayload = {
//   userId: string;
//   expiresAt: Date;
// };

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log(error);
    console.log("Failed to verify session");
  }
}
