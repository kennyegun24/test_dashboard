import connectMongoDb from "@/lib/mongodb";
import TermsOfService from "@/models/TermsOfService";
import { userRolesAre } from "@/utils/checkRoles";
import { saveLogActivity } from "@/utils/logHelper";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connectMongoDb();

    const terms = await TermsOfService.findOne().sort({ createdAt: -1 });

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
    const isUserAllowed = await userRolesAre(
      "67a7c7958d31ffec5db42ace",
      "EDIT_TERMS_CONDITIONS"
    );
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that!" },
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
    const existingTerms = await TermsOfService.findOne().sort({
      createdAt: -1,
    });

    if (existingTerms) {
      existingTerms.body = content;
      await existingTerms.save();
      await saveLogActivity({
        action: "TERMS_OF_SERVICE_UPDATED",
        resource: "TERMS_OF_SERVICE",
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
      const newTerms = new TermsOfService({ body: content });
      await newTerms.save();
      await saveLogActivity({
        action: "TERMS_OF_SERVICE_CREATED",
        resource: "TERMS_OF_SERVICE",
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
