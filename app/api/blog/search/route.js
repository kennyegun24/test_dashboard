import { NextResponse } from "next/server";
import connectMongoDb from "@/lib/mongodb";
import Blog from "@/models/Blogs"; // Make sure this path is correct

export async function GET(request) {
  try {
    await connectMongoDb();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    const regex = new RegExp(query, "i");

    const results = await Blog.find({
      $or: [
        { short_summary: { $regex: regex } },
        { title: { $regex: regex } },
        { body: { $regex: regex } },
      ],
    })
      .limit(20)
      .exec();

    return NextResponse.json({ success: true, data: results });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
