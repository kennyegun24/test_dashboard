import connectMongoDb from "@/lib/mongodb";
import Projects from "@/models/Projects";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req, { params }) => {
  const { projectId } = await params;
  try {
    await connectMongoDb();
    const project = await Projects.findOne({ _id: projectId });
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
};
