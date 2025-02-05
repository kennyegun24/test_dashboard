import connectMongoDb from "@/lib/mongodb";
import Sales from "@/models/Sold";
import { userRolesAre } from "@/utils/checkRoles";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connectMongoDb();
    const isUserAllowed = await userRolesAre(
      "67a2391d5c2ebd68a5c71b07",
      "SALES"
    );
    if (!isUserAllowed) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    // Fetch all sales sorted by newest (most recent createdAt first)
    const sales = await Sales.find().sort({ createdAt: -1 });
    return NextResponse.json({ data: sales }, { status: 200 });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales" },
      { status: 500 }
    );
  }
};
