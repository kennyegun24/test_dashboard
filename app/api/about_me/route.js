import connectMongoDb from "@/lib/mongodb";
import AboutMe from "@/models/AboutMe";
import { userRolesAre } from "@/utils/checkRoles";
import { saveLogActivity } from "@/utils/logHelper";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectMongoDb();
    const { header, body } = await req.json();

    if (!header || !body) {
      return NextResponse.json(
        {
          success: false,
          error: "Header and Body are required fields.",
        },
        { status: 400 }
      );
    }
    const isUserAllowed = await userRolesAre(
      "67a7c7958d31ffec5db42ace",
      "COMPANY_CONTENT"
    );
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that!" },
        { status: 401 }
      );
    }
    const existingAboutMe = await AboutMe.findOne({});
    if (existingAboutMe) {
      if (header) existingAboutMe.header = header;
      if (body) existingAboutMe.body = body;
      const updatedAboutMe = await existingAboutMe.save();
      await saveLogActivity({
        action: "ABOUT_ME_CHANGED",
        resource: "About me",
        details: {
          time: updatedAboutMe.updatedAt,
        },
      });
      return NextResponse.json(
        {
          success: true,
          message: "About Me details updated successfully.",
          aboutMe: updatedAboutMe,
        },
        { status: 200 }
      );
    }

    const newAboutMe = new AboutMe({ header, body });
    const saveAboutMe = await newAboutMe.save();
    await saveLogActivity({
      action: "ABOUT_ME_CHANGED",
      resource: "About me",
      details: {
        time: saveAboutMe.updatedAt,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "About Me details created successfully.",
        aboutMe: newAboutMe,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving About Me details:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error. Unable to save About Me details.",
        error: "Server error. Unable to save About Me details.",
      },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connectMongoDb();

    const aboutMe = await AboutMe.findOne({});

    if (!aboutMe) {
      return NextResponse.json(
        {
          success: false,
          message: "No About Me details found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "About Me details retrieved successfully.",
        aboutMe,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching About Me details:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error. Unable to fetch About Me details.",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
