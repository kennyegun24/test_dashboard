import connectMongoDb from "@/lib/mongodb";
import { checkIfUserIsValid, verifyTokenAndAuthz } from "@/lib/verifyToken";
import PrivacyPolicy from "@/models/PrivacyPolicy";
import { userRolesAre } from "@/utils/checkRoles";
import { saveLogActivity } from "@/utils/logHelper";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connectMongoDb();

    const terms = await PrivacyPolicy.findOne().sort({ createdAt: -1 });

    if (!terms) {
      return NextResponse.json(
        { success: false, message: "Terms of Service not found." },
        { status: 404 }
      );
    }
    console.log(terms);
    return NextResponse.json({ success: true, terms }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    await connectMongoDb();
    const userId = req?.headers?.get("userId");
    const verify = await verifyTokenAndAuthz(req, userId);
    // Check if the user is valid
    const check = checkIfUserIsValid(verify, userId);
    // console.log(check);
    if (check) {
      return NextResponse.json(
        { error: check.message },
        { status: check.status }
      );
    }

    const isUserAllowed = await userRolesAre(userId, "EDIT_PRIVACY_POLICY");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
      );
    }
    const { content } = await req.json();
    if (!content) {
      return NextResponse.json(
        { success: false, error: "Content is required." },
        { status: 400 }
      );
    }
    const existingTerms = await PrivacyPolicy.findOne().sort({
      createdAt: -1,
    });

    if (existingTerms) {
      existingTerms.body = content;
      await existingTerms.save();
      await saveLogActivity({
        action: "PRIVACY_POLICY_UPDATED",
        resource: "PRIVACY_POLICY",
        details: {
          time: Date.now(),
        },
      });
      return NextResponse.json(
        {
          success: true,
          message: "Terms of Service updated successfully!",
          terms: existingTerms,
        },
        { status: 200 }
      );
    } else {
      const newTerms = new PrivacyPolicy({ body: content });
      await newTerms.save();
      await saveLogActivity({
        action: "PRIVACY_POLICY_CREATED",
        resource: "PRIVACY_POLICY",
        details: {
          time: Date.now(),
        },
      });
      return NextResponse.json(
        {
          success: true,
          message: "Terms of Service created successfully!",
          terms: newTerms,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
};
