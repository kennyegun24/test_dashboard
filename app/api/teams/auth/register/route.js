import CryptoJS from "crypto-js";
import Teams from "@/models/Teams";
import { NextResponse } from "next/server";
import connectMongoDb from "@/lib/mongodb";
import crypto from "crypto";
import { sendInvite } from "@/utils/sendInvite";

export const POST = async (req) => {
  const { code, email, password: user_password } = await req.json();

  try {
    await connectMongoDb();

    const user = await Teams.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.email_confirm) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    if (Date.now() > user.email_confirm_expire) {
      const newCode = crypto.randomBytes(15).toString("hex");

      await Teams.findOneAndUpdate(
        { email },
        {
          email_confirm_code: newCode,
          email_confirm_expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
        }
      );

      await sendInvite({
        user_email: email,
        subject: "New verification code",
        name: user.full_name,
        role: user.roles.join(", "),
        code: newCode,
      });

      return NextResponse.json(
        {
          error: "Code expired. A new code has been sent to your email.",
        },
        { status: 401 }
      );
    }

    if (user.email_confirm_code !== code) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 }
      );
    }

    if (!user_password || user_password.trim() === "") {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    const encryptedPassword = CryptoJS.AES.encrypt(
      user_password,
      process.env.CRYPTO_JS_SEC
    ).toString();

    await Teams.findOneAndUpdate(
      { email },
      {
        password: encryptedPassword,
        email_confirm: true,
        email_confirm_code: null,
        email_confirm_expire: null,
      }
    );

    return NextResponse.json(
      { message: "Email successfully verified!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email confirmation error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};

// export const POST = async (req) => {
//   const body = await req.json();
//   const { code, email, password: user_password } = await body;
//   try {
//     await connectMongoDb();

//     const findUser = await Teams.findOne({ email: email });
//     console.log(findUser);
//     console.log(user_password);
//     if (!findUser)
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     if (findUser) {
//       console.log("user found");
//       if (
//         !findUser?.email_confirm &&
//         (findUser?.email_confirm_code === code ||
//           Date.now() > findUser.email_confirm_expire)
//       ) {
//         console.log("passed first check");
//         // Generate new verification code if the old one expired
//         if (Date.now() > findUser.email_confirm_expire) {
//           console.log("time is right");
//           const email_confirm_code = crypto.randomBytes(15).toString("hex");
//           await Teams.findOneAndUpdate(
//             { email: email },
//             {
//               email_confirm_code: email_confirm_code,
//               email_confirm_expire: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
//             }
//           );

//           await sendInvite({
//             user_email: email,
//             subject: "Invited to Join AJL Webcraft team",
//             name: findUser?.full_name,
//             role: findUser.roles.join(", "),
//             code: email_confirm_code,
//           });

//           return NextResponse.json(
//             {
//               error:
//                 "Email not yet verified... New verification code sent to your mail!",
//             },
//             { status: 401 }
//           );
//         } else if (
//           findUser?.email_confirm_code === code &&
//           Date.now() <= findUser.email_confirm_expire
//         ) {
//           await Teams.findOneAndUpdate(
//             { email: email },
//             {
//               password: CryptoJS.AES.encrypt(
//                 user_password,
//                 process.env.CRYPTO_JS_SEC
//               ).toString(),
//               email_confirm_code: null,
//               email_confirm_expire: null,
//               email_confirm: true,
//             }
//           );

//           return NextResponse.json(
//             { message: "Email successfully verified!" },
//             { status: 201 }
//           );
//         }
//       }
//       return NextResponse.json(
//         { error: "Email verified already" },
//         { status: 400 }
//       );
//       // Confirm email only if code matches and is not expired
//     }
//   } catch (error) {
//     console.log(error, "error");
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// };
