import Teams from "@/models/Teams"; // Adjust the path to your Teams model
import dbConnect from "@/lib/mongodb"; // Function to connect to your MongoDB
import { NextResponse } from "next/server";
import { sendInvite } from "@/utils/sendInvite";
import { saveLogActivity } from "@/utils/logHelper";

export const DELETE = async (req) => {
  try {
    await dbConnect();

    // Parse the request body
    const body = await req.json();
    const { email, full_name } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: "All required fields must be provided." },
        { status: 400 }
      );
    }

    // Create a new team member
    const deleteRole = await Teams.findOneAndDelete({ email: email });

    if (!deleteRole) {
      return NextResponse.json(
        { error: "Team member not found." },
        { status: 404 }
      );
    }
    await sendInvite({
      user_email: email,
      subject: "You have been removed from AJL Webcraft team. ACCOUNT DELETED!",
      name: full_name,
    });
    await saveLogActivity({
      action: "ROLE_DELETE",
      resource: "TEAM",
      details: {
        name: full_name,
        time: Date.now(),
      },
    });

    // Return the created team member
    return NextResponse.json({ data: deleteRole }, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);

    // Return an error response
    return NextResponse.json(
      { error: "Failed to create team member." },
      { status: 500 }
    );
  }
};
