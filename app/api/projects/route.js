import { NextResponse } from "next/server";
import connectMongoDb from "@/lib/mongodb";
import Project from "@/models/Projects";
import Projects from "@/models/Projects";

export async function POST(req) {
  try {
    await connectMongoDb();

    const body = await req.json();

    const project = await Project.create(body);

    return NextResponse.json(
      {
        success: true,
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Project Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create project",
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    await connectMongoDb();
    const projects = await Projects.find();
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "SOMETHING WENT WRONG",
      },
      { status: 400 }
    );
  }
}
