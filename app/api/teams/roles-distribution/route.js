import dbConnect from "@/lib/mongodb";
import { checkIfUserIsValid, verifyTokenAndAuthz } from "@/lib/verifyToken";
import Teams from "@/models/Teams";
import { userRolesAre } from "@/utils/checkRoles";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  try {
    await dbConnect();
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

    const isUserAllowed = await userRolesAre(userId, "VIEW_TEAMS");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
      );
    }
    // Fetch all team members
    const teamMembers = await Teams.find({}).lean();

    if (teamMembers.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // Count occurrences of each role
    const roleCounts = teamMembers.reduce((acc, member) => {
      const roles = Array.isArray(member.roles) ? member.roles : ["Unknown"]; // Default to ["Unknown"] if no roles exist
      roles.forEach((role) => {
        acc[role] = (acc[role] || 0) + 1;
      });
      return acc;
    }, {});

    // Convert the roleCounts object to an array of objects with role and count
    const roleArray = Object.entries(roleCounts).map(([role, count]) => ({
      role,
      no: count,
    }));

    // Sort roles by count in descending order
    const sortedRoles = roleArray.sort((a, b) => b.no - a.no);

    // Return the role distribution data
    return NextResponse.json(
      { data: sortedRoles },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching role distribution:", error);
    return NextResponse.json(
      {
        error: "An error occurred while fetching the role distribution.",
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
