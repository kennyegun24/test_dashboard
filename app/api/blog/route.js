import connectMongoDb from "@/lib/mongodb";
import Blog from "@/models/Blogs";
import { saveLogActivity } from "@/utils/logHelper";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectMongoDb();

    const {
      body,
      title,
      short_summary,
      cover_image,
      docs,
      meta_page_title,
      meta_desc,
      key_tags,
      meta_keywords,
    } = await req.json();

    // Validate required fields
    if (
      !body ||
      !title ||
      !short_summary ||
      !cover_image ||
      !meta_page_title ||
      !meta_keywords ||
      !meta_desc
    ) {
      return NextResponse.json(
        { success: false, error: "Required fields are missing." },
        { status: 400 }
      );
    }

    const newBlog = new Blog({
      body,
      title,
      short_summary,
      cover_image,
      docs,
      meta_page_title,
      meta_keywords,
      meta_desc,
      key_tags,
    });

    await newBlog.save();
    await saveLogActivity({
      action: "BLOG_ADDED",
      resource: "BLOG",
      details: {
        time: Date.now(),
        title: title,
      },
    });

    return NextResponse.json(
      { success: true, message: "Blog created successfully!", blog: newBlog },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connectMongoDb();

    const blogs = await Blog.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, blogs }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
};
