import connectMongoDb from "@/lib/mongodb";
import Teams from "@/models/Teams";
import CryptoJS from "crypto-js";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendInvite } from "@/utils/sendInvite";

export const POST = async (req, res) => {
  const body = await req.json();
  const { password: userPassword, email } = await body;
  try {
    await connectMongoDb();
    const findUser = await Teams.findOne({ email: email });
    if (findUser) {
      const decryptPassword = CryptoJS.AES.decrypt(
        findUser.password,
        process.env.CRYPTO_JS_SEC
      );
      const password = decryptPassword.toString(CryptoJS.enc.Utf8);
      if (password === userPassword) {
        if (!findUser?.email_confirm) {
          const email_confirm_code = crypto.randomBytes(15).toString("hex");
          await Teams.findOneAndUpdate(
            {
              email: email,
            },
            {
              email_confirm_code: email_confirm_code,
              email_confirm_expire: Date.now() + 30 * 60 * 1000,
            }
          );
          await sendInvite({
            user_email: email,
            subject: "Invited to Join AJL Webcraft team",
            name: findUser.full_name,
            code: email_confirm_code,
          });
          return NextResponse.json(
            {
              error:
                "Email not yet verified... Verification code sent to your mail!",
            },
            {
              status: 401,
            }
          );
        }
        const { password, ...others } = findUser._doc;
        const expiresIn = Date.now() + 3 * 24 * 60 * 60 * 1000;
        const access_token = jwt.sign(
          {
            id: findUser._id,
          },
          process.env.JWT_KEY,
          { expiresIn: "3d" }
        );
        return NextResponse.json(
          {
            ...others,
            access_token,
            expiresIn: expiresIn,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "Wrong email or password" },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Account does not exist" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
};
