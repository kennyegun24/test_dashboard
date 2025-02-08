import FAQ from "@/models/FAQ"; // Import the FAQ model
import { NextResponse } from "next/server";
import connectMongoDb from "@/lib/mongodb";
import { saveLogActivity } from "@/utils/logHelper";
import { userRolesAre } from "@/utils/checkRoles";

export const dynamic = "force-dynamic";

export const GET = async (req, res) => {
  try {
    await connectMongoDb(); // Ensure the database connection

    // Fetch all FAQs
    const faqs = await FAQ.find();

    // Return the FAQs in the response
    return NextResponse.json(
      { success: true, faqs: faqs },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch FAQs",
      },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
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
    const { faqs } = await req.json();

    if (!Array.isArray(faqs) || faqs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "FAQs must be an array with at least one entry.",
        },
        { status: 400 }
      );
    }

    const invalidFaqs = faqs.filter((faq) => !faq.question || !faq.answer);

    if (invalidFaqs.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Each FAQ must have a question and an answer.",
        },
        { status: 400 }
      );
    }

    const newFAQs = await FAQ.insertMany(faqs);
    await saveLogActivity({
      action: "FAQ_ADDED",
      resource: "FAQ",
      details: {
        time: Date.now(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "FAQs added successfully.",
        faqs: newFAQs,
      },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error adding FAQs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add FAQs. Please try again.",
      },
      { status: 500 }
    );
  }
};
