import Teams from "@/models/Teams"; // Adjust the path to your Teams model
import dbConnect from "@/lib/mongodb"; // Function to connect to your MongoDB
import { NextResponse } from "next/server";
import { sendInvite } from "@/utils/sendInvite";
import { saveLogActivity } from "@/utils/logHelper";

export const POST = async (req) => {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const body = await req.json();
    console.log(body);
    const { roles, email, full_name, contact } = body;

    // Validate required fields
    if (!roles || !email || !full_name || !contact) {
      return NextResponse.json(
        { error: "All required fields must be provided." },
        { status: 400 }
      );
    }

    const checkIfExists = await Teams.findOne({ email: email });
    if (checkIfExists) {
      existingUser.roles = [...new Set([...roles])]; // Merge and ensure unique roles
      const updatedUser = await existingUser.save();

      await saveLogActivity({
        action: "ROLE_UPDATE",
        resource: "TEAM",
        details: {
          name: existingUser.full_name,
          updatedRoles: roles,
          time: Date.now(),
        },
      });

      return NextResponse.json(
        { message: "User roles updated successfully.", data: updatedUser },
        { status: 200 }
      );
    }

    // Create a new team member
    const newTeamMember = new Teams({
      roles,
      email,
      full_name,
      contact,
    });

    // Save the team member to the database
    const savedTeamMember = await newTeamMember.save();
    await sendInvite({
      user_email: email,
      subject: "Invited to Join AJL Webcraft team",
      name: full_name,
      role: roles,
    });
    await saveLogActivity({
      action: "ROLE_INVITE",
      resource: "TEAM",
      details: {
        name: full_name,
        role: roles,
        time: Date.now(),
      },
    });

    // Return the created team member
    return NextResponse.json({ data: savedTeamMember }, { status: 201 });
  } catch (error) {
    let err = "";
    const errors = error.errors;
    if (errors?.contact) {
      err = error.errors?.contact?.message;
    } else if (errors?.email) {
      err = error.errors?.email?.message;
    } else {
      err = "Failed to create team member";
    }
    console.log(error.errors);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
