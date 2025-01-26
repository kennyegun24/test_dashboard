import connectMongoDb from "@/lib/mongodb";
import Sales from "@/models/Sold";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectMongoDb();
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
