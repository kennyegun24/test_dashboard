import connectMongoDb from "@/lib/mongodb";
import { checkIfUserIsValid, verifyTokenAndAuthz } from "@/lib/verifyToken";
import Blog from "@/models/Blogs";
import { userRolesAre } from "@/utils/checkRoles";
import { saveLogActivity } from "@/utils/logHelper";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
    const userId = req?.headers?.get("userId");
    const verify = await verifyTokenAndAuthz(req, userId);
    // Check if the user is valid
    const check = checkIfUserIsValid(verify, userId);
    // console.log(check);
    if (check) {
      return NextResponse.json(
        { error: check.message },
        { status: check.status }
      );
    }

    const isUserAllowed = await userRolesAre(userId, "WRITE_BLOG");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
      );
    }
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
