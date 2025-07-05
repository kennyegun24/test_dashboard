import { NextResponse } from "next/server";
import { connectMongoDb } from "@/lib/mongodb";
import Teams from "@/models/Teams";
// import Teams from "@/models/team";

export const POST = async (req) => {
  try {
    await connectMongoDb();
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code required" },
        { status: 400 }
      );
    }

    const user = await Teams.findOne({ email });

    if (!user || user.email_confirm_code !== code) {
      return NextResponse.json(
        { error: "Invalid code or email" },
        { status: 401 }
      );
    }

    if (user.email_confirm_expire < Date.now()) {
      return NextResponse.json({ error: "Code expired" }, { status: 410 });
    }

    user.email_confirm = true;
    user.email_confirm_code = null;
    user.email_confirm_expire = null;

    await user.save();

    return NextResponse.json(
      { message: "Email confirmed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
