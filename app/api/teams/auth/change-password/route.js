import { NextResponse } from "next/server";
import connectMongoDb from "@/lib/mongodb";
import CryptoJS from "crypto-js";
import Teams from "@/models/Teams";

export const POST = async (req) => {
  try {
    await connectMongoDb();

    const { email, otp, newPassword } = await req.json();
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, OTP, and new password are required." },
        { status: 400 }
      );
    }

    const user = await Teams.findOne({ email });
    console.log(user);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (
      !user.password_reset_otp ||
      user.password_reset_otp !== otp ||
      user.password_reset_expire < Date.now()
    ) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 401 }
      );
    }

    const hashedPassword = CryptoJS.AES.encrypt(
      newPassword,
      process.env.CRYPTO_JS_SEC
    ).toString();

    user.password = hashedPassword;
    user.password_reset_otp = null;
    user.password_reset_expire = null;
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
};
