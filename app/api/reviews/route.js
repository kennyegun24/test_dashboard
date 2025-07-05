import connectMongoDb from "@/lib/mongodb";
import Review from "@/models/Reviews";
import { userRolesAre } from "@/utils/checkRoles";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await connectMongoDb();
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(5);
    return NextResponse.json(
      { reviews },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const POST = async (req) => {
  try {
    await connectMongoDb();
    const { clientName, clientReview, clientImage, hashtags } =
      await req.json();

    if (!clientName || !clientReview) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const userId = req?.headers?.get("userId");
    const isUserAllowed = await userRolesAre(userId, "REVIEWS");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
      );
    }
    const newReview = new Review({
      clientName,
      clientReview,
      clientImage,
      hashtags,
      createdAt: new Date(),
    });

    await newReview.save();

    return NextResponse.json(
      {
        message: "Review created successfully",
        review: newReview,
      },
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const PUT = async (req) => {
  try {
    await connectMongoDb();
    const { id, clientName, clientReview, clientImage, hashtags } =
      await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }
    const userId = req?.headers?.get("userId");
    const isUserAllowed = await userRolesAre(userId, "REVIEWS");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
      );
    }
    const updateData = {};
    if (clientName !== undefined) updateData.clientName = clientName;
    if (clientReview !== undefined) updateData.clientReview = clientReview;
    if (clientImage !== undefined) updateData.clientImage = clientImage;
    if (hashtags !== undefined) updateData.hashtags = hashtags;

    const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Review updated successfully",
        review: updatedReview,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    await connectMongoDb();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required." },
        { status: 400 }
      );
    }
    const userId = req?.headers?.get("userId");
    const isUserAllowed = await userRolesAre(userId, "REVIEWS");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
      );
    }
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Review deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
};
