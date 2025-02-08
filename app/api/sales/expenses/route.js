import connectMongoDb from "@/lib/mongodb";
import Sales from "@/models/Sold";
import { userRolesAre } from "@/utils/checkRoles";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Endpoint to query expenses breakdown
export const GET = async (req, res) => {
  try {
    await connectMongoDb();
    const isUserAllowed = await userRolesAre(
      "67a7c7958d31ffec5db42ace",
      "SALES"
    );
    if (!isUserAllowed) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    // Fetch all sales and aggregate expenses
    const sales = await Sales.aggregate([
      { $match: { status: "Completed" } },
      { $unwind: "$expenses" },
      {
        $group: {
          _id: "$expenses.expense",
          totalCost: { $sum: "$expenses.amount" },
        },
      },
      {
        $sort: { totalCost: -1 },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: sales,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
