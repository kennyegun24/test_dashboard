import Service from "@/models/Service"; // Import the Service model
import connectMongoDb from "@/lib/mongodb"; // Ensure your MongoDB connection utility is set up
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectMongoDb();

    const { title, body, short_desc } = await req.json();

    if (!title || !body || !short_desc) {
      return NextResponse.json(
        { error: "All fields are required: title, body, short_desc" },
        { status: 400 }
      );
    }

    const newService = new Service({
      title,
      body,
      short_desc,
    });

    await newService.save();

    return NextResponse.json(
      { message: "Service created successfully", service: newService },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connectMongoDb();

    const services = await Service.find();

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
};
