import CryptoJS from "crypto-js";
import Teams from "@/models/Teams";
import { NextResponse } from "next/server";
import connectMongoDb from "@/lib/mongodb";
import crypto from "crypto";
import { sendInvite } from "@/utils/sendInvite";

export const POST = async (req) => {
  const body = await req.json();
  const { code, email, password: user_password } = await body;
  try {
    await connectMongoDb();

    const findUser = await Teams.findOne({ email: email });
    console.log(code);
    if (findUser) {
      console.log("user found");
      if (
        !findUser?.email_confirm &&
        (findUser?.email_confirm_code === code ||
          Date.now() > findUser.email_confirm_expire)
      ) {
        console.log("passed first check");
        // Generate new verification code if the old one expired
        if (Date.now() > findUser.email_confirm_expire) {
          console.log("time is right");
          const email_confirm_code = crypto.randomBytes(15).toString("hex");
          await Teams.findOneAndUpdate(
            { email: email },
            {
              email_confirm_code: email_confirm_code,
              email_confirm_expire: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
            }
          );

          await sendInvite({
            user_email: email,
            subject: "Invited to Join AJL Webcraft team",
            name: findUser?.full_name,
            role: findUser.roles.join(", "),
            code: email_confirm_code,
          });

          return NextResponse.json(
            {
              error:
                "Email not yet verified... New verification code sent to your mail!",
            },
            { status: 401 }
          );
        } else if (
          findUser?.email_confirm_code === code &&
          Date.now() <= findUser.email_confirm_expire
        ) {
          await Teams.findOneAndUpdate(
            { email: email },
            {
              password: CryptoJS.AES.encrypt(
                user_password,
                process.env.CRYPTO_JS_SEC
              ).toString(),
              email_confirm_code: null,
              email_confirm_expire: null,
              email_confirm: true,
            }
          );

          return NextResponse.json(
            { message: "Email successfully verified!" },
            { status: 201 }
          );
        }
      }
      // Confirm email only if code matches and is not expired
    }

    return NextResponse.json({ message: "User not found" }, { status: 404 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};
