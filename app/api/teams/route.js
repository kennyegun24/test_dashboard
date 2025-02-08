import connectMongoDb from "@/lib/mongodb";

const { default: Teams } = require("@/models/Teams");
const { NextResponse } = require("next/server");
import { userRolesAre } from "@/utils/checkRoles";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connectMongoDb();
    const isUserAllowed = await userRolesAre(
      "67a7c7958d31ffec5db42ace",
      "VIEW_TEAMS"
    );
    if (!isUserAllowed) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const teams = await Teams.find();
    return NextResponse.json(
      {
        data: teams,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
