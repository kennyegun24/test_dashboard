import Service from "@/models/Service"; // Import the Service model
import connectMongoDb from "@/lib/mongodb"; // Ensure your MongoDB connection utility is set up
import { NextResponse } from "next/server";
import { userRolesAre } from "@/utils/checkRoles";

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
    const userId = req?.headers?.get("userId");
    const isUserAllowed = await userRolesAre(userId, "SERVICES");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
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

export const PUT = async (req) => {
  try {
    await connectMongoDb();

    const { id, title, body, short_desc } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }
    const userId = req?.headers?.get("userId");
    const isUserAllowed = await userRolesAre(userId, "SERVICES");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
      );
    }
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (body !== undefined) updateData.body = body;
    if (short_desc !== undefined) updateData.short_desc = short_desc;

    const updatedService = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Service updated successfully", service: updatedService },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating service:", error);
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

export const DELETE = async (req) => {
  try {
    await connectMongoDb();
    const body = await req.json();
    const { id } = body; // Expecting JSON payload with "id"
    console.log(id);
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const userId = req?.headers?.get("userId");
    const isUserAllowed = await userRolesAre(userId, "SERVICES");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
      );
    }
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
