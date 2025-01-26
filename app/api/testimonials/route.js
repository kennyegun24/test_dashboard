import Testimonial from "@/models/Testimonials";
import connectMongoDb from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectMongoDb();

    const { client_name, image, review, hashtags } = await req.json();

    if (!client_name || !image || !review) {
      return NextResponse.json(
        { error: "All required fields must be filled." },
        { status: 400 }
      );
    }

    const newTestimonial = new Testimonial({
      client_name,
      image,
      review,
      hashtags,
    });

    await newTestimonial.save();

    return NextResponse.json(
      {
        success: true,
        message: "Testimonial added successfully!",
        testimonial: newTestimonial,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
};

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connectMongoDb();

    const testimonials = await Testimonial.find();

    return NextResponse.json(
      {
        success: true,
        testimonials,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
};
