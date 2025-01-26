import connectMongoDb from "@/lib/mongodb";

const { default: Teams } = require("@/models/Teams");
const { NextResponse } = require("next/server");

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connectMongoDb();
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
