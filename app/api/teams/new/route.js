import Teams from "@/models/Teams"; // Adjust the path to your Teams model
import dbConnect from "@/lib/mongodb"; // Function to connect to your MongoDB
import { NextResponse } from "next/server";
import { sendInvite } from "@/utils/sendInvite";
import { saveLogActivity } from "@/utils/logHelper";
import { userRolesAre } from "@/utils/checkRoles";
import crypto from "crypto";
import { checkIfUserIsValid, verifyTokenAndAuthz } from "@/lib/verifyToken";

export const POST = async (req) => {
  try {
    await dbConnect();

    const body = await req.json();
    const { roles, email, full_name, contact } = body;

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
    if (!roles || !email || !full_name || !contact) {
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
    const checkIfExists = await Teams.findOne({ email: email });
    if (checkIfExists) {
      checkIfExists.roles = [...new Set([...roles])];
      const updatedUser = await checkIfExists.save();

      await saveLogActivity({
        action: "ROLE_UPDATE",
        resource: "TEAM",
        details: {
          name: checkIfExists.full_name,
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
    const email_confirm_code = crypto.randomBytes(15).toString("hex");
    const newTeamMember = new Teams({
      roles,
      email,
      full_name,
      contact,
      email_confirm_expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
      email_confirm_code,
    });

    // Save the team member to the database
    const savedTeamMember = await newTeamMember.save();
    await sendInvite({
      user_email: email,
      subject: "Invited to Join AJL Webcraft team",
      name: full_name,
      role: roles,
      code: email_confirm_code,
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
    return NextResponse.json({ data: "savedTeamMember" }, { status: 201 });
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
    console.log(error);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
