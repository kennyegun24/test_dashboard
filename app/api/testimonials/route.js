import connectMongoDb from "@/lib/mongodb";
import Review from "@/models/Reviews";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
    console.log(error);
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

    if (!clientName || !clientReview || !clientImage || !hashtags) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400, headers: { "Content-Type": "application/json" } }
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
