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

export const DELETE = async (req) => {
  try {
    await connectMongoDb();

    const { id } = await req.json();
    const userId = req?.headers?.get("userId");
    console.log(userId, "userid");
    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required." },
        { status: 400 }
      );
    }

    const verify = await verifyTokenAndAuthz(req, userId);
    const check = checkIfUserIsValid(verify, userId);
    if (check) {
      return NextResponse.json(
        { error: check.message },
        { status: check.status }
      );
    }

    const isUserAllowed = await userRolesAre(userId, "WRITE_BLOG");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to delete blogs." },
        { status: 401 }
      );
    }

    const deleted = await Blog.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Blog not found or already deleted." },
        { status: 404 }
      );
    }

    await saveLogActivity({
      action: "BLOG_DELETED",
      resource: "BLOG",
      details: {
        time: Date.now(),
        title: deleted.title,
      },
    });

    return NextResponse.json(
      { success: true, message: "Blog deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete blog error:", error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    await connectMongoDb();

    const {
      id, // <-- required
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required for update." },
        { status: 400 }
      );
    }

    const verify = await verifyTokenAndAuthz(req, userId);
    const check = checkIfUserIsValid(verify, userId);
    if (check) {
      return NextResponse.json(
        { error: check.message },
        { status: check.status }
      );
    }

    const isUserAllowed = await userRolesAre(userId, "WRITE_BLOG");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to update blogs." },
        { status: 401 }
      );
    }

    // Build update object (only update what's provided)
    const updateData = {};
    if (body !== undefined || body !== null) updateData.body = body;
    if (title !== undefined || title !== null) updateData.title = title;
    if (short_summary !== undefined || short_summary !== null)
      updateData.short_summary = short_summary;
    if (cover_image !== undefined || cover_image !== null)
      updateData.cover_image = cover_image;
    if (docs !== undefined || docs !== null) updateData.docs = docs;
    if (meta_page_title !== undefined || meta_page_title !== null)
      updateData.meta_page_title = meta_page_title;
    if (meta_desc !== undefined || meta_desc !== null)
      updateData.meta_desc = meta_desc;
    if (key_tags !== undefined || key_tags !== null)
      updateData.key_tags = key_tags;
    if (meta_keywords !== undefined || meta_keywords !== null)
      updateData.meta_keywords = meta_keywords;

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, error: "Blog not found." },
        { status: 404 }
      );
    }

    await saveLogActivity({
      action: "BLOG_UPDATED",
      resource: "BLOG",
      details: {
        time: Date.now(),
        title: updatedBlog.title,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Blog updated successfully!",
        blog: updatedBlog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
};
