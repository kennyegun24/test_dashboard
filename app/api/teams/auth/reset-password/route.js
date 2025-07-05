import { NextResponse } from "next/server";
import connectMongoDb from "@/lib/mongodb";
// import Teams from "@/models/team";
import crypto from "crypto";
import Teams from "@/models/Teams";
import { sendOtpMail } from "@/utils/sendOTP";
// import { sendOtpMail } from "@/lib/mail"; // your mail function

export const POST = async (req) => {
  try {
    await connectMongoDb();

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const user = await Teams.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Email not found." }, { status: 404 });
    }

    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.password_reset_otp = otp;
    user.password_reset_expire = otpExpire;
    await user.save();

    await sendOtpMail({
      to: email,
      subject: "Your Password Reset OTP",
      otp,
    });

    return NextResponse.json(
      { message: "OTP sent to email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
};
