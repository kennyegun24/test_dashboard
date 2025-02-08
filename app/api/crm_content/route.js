import connectMongoDb from "@/lib/mongodb";
import Content from "@/models/Content";
import { userRolesAre } from "@/utils/checkRoles";
import { saveLogActivity } from "@/utils/logHelper";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connectMongoDb();

    const content = await Content.findOne({});

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          message: "No content found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Content retrieved successfully.",
        content,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error. Unable to retrieve content.",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    const { logo, company_name, phone, email, socials } = await req.json();
    console.log(email, phone);
    if (!logo && !company_name && !phone && !email && !socials) {
      return NextResponse.json(
        { success: false, error: "At least one field is required" },
        { status: 400 }
      );
    }

    await connectMongoDb();
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
    const existingContent = await Content.findOne({});

    if (!existingContent) {
      const newContent = new Content({
        logo,
        company_name,
        phone,
        email,
        socials,
      });
      await newContent.save();
      return NextResponse.json(
        {
          success: true,
          message: "Content created successfully",
          content: newContent,
        },
        { status: 201 }
      );
    }

    if (logo) existingContent.logo = logo;
    if (company_name) existingContent.company_name = company_name;
    if (phone) existingContent.phone = phone;
    if (email) existingContent.email = email;

    if (socials) {
      socials.forEach((newSocial) => {
        if (newSocial.url) {
          const index = existingContent.socials.findIndex(
            (social) => social.platform === newSocial.platform
          );
          if (index !== -1) {
            existingContent.socials[index] = newSocial;
          } else {
            existingContent.socials.push(newSocial);
          }
        }
      });
    }

    const updatedContent = await existingContent.save();
    if (logo)
      await saveLogActivity({
        action: "LOGO_CHANGED",
        resource: "LOGO",
        details: {
          time: Date.now(),
        },
      });

    if (company_name)
      await saveLogActivity({
        action: "COMPANY_NAME_CHANGED",
        resource: "COMPANY NAME",
        details: {
          time: Date.now(),
          companyName: company_name,
        },
      });

    if (phone)
      await saveLogActivity({
        action: "CONTACT_CHANGE",
        resource: "CONTACT",
        details: {
          time: Date.now(),
        },
      });

    if (socials)
      await saveLogActivity({
        action: "SOCIALS_UPDATE",
        resource: "SOCIALS",
        details: {
          time: Date.now(),
        },
      });

    return NextResponse.json(
      {
        success: true,
        message: "Content updated successfully",
        content: updatedContent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
};
