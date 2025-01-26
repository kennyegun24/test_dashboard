import connectMongoDb from "@/lib/mongodb";
import Blog from "@/models/Blogs";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const { blogId } = await params;
  console.log(blogId);
  try {
    await connectMongoDb();
    const blog = await Blog.findOne({ _id: blogId });
    return NextResponse.json({ success: true, blog }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
};
