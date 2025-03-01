import Teams from "@/models/Teams"; // Adjust the path to your Teams model
import dbConnect from "@/lib/mongodb"; // Function to connect to your MongoDB
import { NextResponse } from "next/server";
import { sendInvite } from "@/utils/sendInvite";
import { saveLogActivity } from "@/utils/logHelper";
import { userRolesAre } from "@/utils/checkRoles";
import { checkIfUserIsValid, verifyTokenAndAuthz } from "@/lib/verifyToken";

export const POST = async (req) => {
  try {
    await dbConnect();

    // Parse the request body
    const body = await req.json();
    const { new_role, email, full_name } = body;

    // Validate required fields
    if (!new_role || !email) {
      return NextResponse.json(
        { error: "All required fields must be provided." },
        { status: 400 }
      );
    }
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
    if (!new_role || !email || !full_name) {
      return NextResponse.json(
        { error: "All required fields must be provided." },
        { status: 400 }
      );
    }
    const isUserAllowed = await userRolesAre(userId, "MANAGE_TEAMS");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
      );
    }
    // Create a new team member
    const updateRole = await Teams.findOneAndUpdate(
      { email: email },
      { roles: new_role },
      { new: true }
    );

    if (!updateRole) {
      return NextResponse.json(
        { error: "Team member not found." },
        { status: 404 }
      );
    }
    await sendInvite({
      user_email: email,
      subject: "Role has been changed",
      name: full_name,
      role: new_role,
    });
    await saveLogActivity({
      action: "ROLE_CHANGE",
      resource: "TEAM",
      details: {
        name: full_name,
        role: new_role,
        time: Date.now(),
      },
    });

    // Return the created team member
    return NextResponse.json({ data: updateRole }, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);

    // Return an error response
    return NextResponse.json(
      { error: "Failed to create team member." },
      { status: 500 }
    );
  }
};
