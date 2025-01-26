import connectMongoDb from "@/lib/mongodb";
import Sales from "@/models/Sold";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
  try {
    await connectMongoDb();
    const timeframe = req.nextUrl.searchParams.get("timeframe");
    const validTimeframes = ["2months", "4months", "6months"];
    if (!timeframe || !validTimeframes.includes(timeframe)) {
      return NextResponse.json(
        {
          error:
            "Invalid or missing timeframe parameter. Use yearly, monthly, or daily.",
        },
        { status: 400 }
      );
    }
    const getMonthNum = timeframe.split("m")[0];
    const convertToNum = Number(getMonthNum);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - convertToNum);
    let filter = {};
    let groupBy = {};
    let completedSales = [];
    console.log(startDate);
    filter = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    groupBy = [
      {
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          status: 1,
        },
      },
      {
        $group: {
          _id: "$day",
          totalCompleted: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, 1, 0],
            },
          },
        },
      },
    ];

    completedSales = await Sales.aggregate([{ $match: filter }, ...groupBy]);

    const fullDateRange = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      fullDateRange.push(currentDate.toISOString().split("T")[0]); // Format as "YYYY-MM-DD"
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const result = fullDateRange.map((date) => {
      const track = completedSales.find((t) => t._id === date);
      return {
        day: date,
        totalCompleted: track ? track.totalCompleted : 0,
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
};
