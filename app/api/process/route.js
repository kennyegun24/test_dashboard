import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
import Process from "@/models/Process";
import connectMongoDb from "@/lib/mongodb";

export async function GET() {
  try {
    await connectMongoDb();
    const process = await Process.findOne({});
    console.log(process);
    if (!process) {
      return NextResponse.json(
        {
          sectionHeader: { mainTitle: "", subheading: "" },
          steps: [
            { title: "", description: "" },
            { title: "", description: "" },
            { title: "", description: "" },
          ],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(process, { status: 200 });
  } catch (error) {
    console.error("GET /process error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongoDb();

    const body = await req.json();
    console.log(body);
    const { sectionHeader, steps } = body;

    // Validate input
    if (!sectionHeader?.mainTitle || !sectionHeader?.subheading) {
      return NextResponse.json(
        { error: "Section header (mainTitle and subheading) is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(steps) || steps.length !== 3) {
      return NextResponse.json(
        { error: "Exactly 3 steps are required." },
        { status: 400 }
      );
    }

    // Validate each step: title and description must be filled
    const hasInvalidStep = steps.some(
      (step) =>
        !step ||
        typeof step !== "object" ||
        !step.title ||
        !step.description ||
        typeof step.title !== "string" ||
        typeof step.description !== "string" ||
        step.title.trim() === "" ||
        step.description.trim() === ""
    );

    if (hasInvalidStep) {
      return NextResponse.json(
        { message: "All 3 steps must have valid title and description." },
        { status: 400 }
      );
    }

    const process = new Process({ sectionHeader, steps });
    const saved = await process.save();

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Error creating process:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await connectMongoDb();

    const body = await req.json();
    const { sectionHeader, steps } = body;

    // Validate sectionHeader
    if (!sectionHeader?.mainTitle || !sectionHeader?.subheading) {
      return NextResponse.json(
        { message: "Section header (mainTitle and subheading) is required." },
        { status: 400 }
      );
    }

    // Validate steps
    if (!Array.isArray(steps) || steps.length !== 3) {
      return NextResponse.json(
        { message: "Exactly 3 steps are required." },
        { status: 400 }
      );
    }

    const hasInvalidStep = steps.some(
      (step) =>
        !step ||
        typeof step !== "object" ||
        !step.title ||
        !step.description ||
        typeof step.title !== "string" ||
        typeof step.description !== "string" ||
        step.title.trim() === "" ||
        step.description.trim() === ""
    );

    if (hasInvalidStep) {
      return NextResponse.json(
        { message: "Each step must include a valid title and description." },
        { status: 400 }
      );
    }

    // Find the only process document (or create one if not exists)
    const updated = await Process.findOneAndUpdate(
      {}, // Match any document
      { sectionHeader, steps },
      {
        new: true,
        upsert: true, // Create if not exists
        runValidators: true,
      }
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating process:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
