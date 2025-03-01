import connectMongoDb from "@/lib/mongodb";
import { checkIfUserIsValid, verifyTokenAndAuthz } from "@/lib/verifyToken";
import Sales from "@/models/Sold";
import { userRolesAre } from "@/utils/checkRoles";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Endpoint to query expenses breakdown
export const GET = async (req, res) => {
  try {
    await connectMongoDb();
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
    const isUserAllowed = await userRolesAre(userId, "SALES");
    if (!isUserAllowed) {
      return NextResponse.json(
        { error: "You are not authorized to do that" },
        { status: 401 }
      );
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
