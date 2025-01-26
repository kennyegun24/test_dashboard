import { NextResponse } from "next/server";
import connectMongoDb from "@/lib/mongodb";
import Sales from "@/models/Sold"; // Your Sales model

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  try {
    await connectMongoDb();
    const timeframe = req.nextUrl.searchParams.get("timeframe");
    const startMonth = req.nextUrl.searchParams.get("startMonth");
    const endMonth = req.nextUrl.searchParams.get("endMonth");

    const validTimeframes = ["yearly", "monthly", "daily"];
    if (!timeframe || !validTimeframes.includes(timeframe)) {
      return NextResponse.json(
        {
          error:
            "Invalid or missing timeframe parameter. Use yearly, monthly, or daily.",
        },
        { status: 400 }
      );
    }

    if (timeframe === "daily") {
      if (!startMonth || !endMonth) {
        return NextResponse.json(
          { error: "Missing startMonth or endMonth for daily timeframe." },
          { status: 400 }
        );
      }

      const start = new Date(startMonth); // Start date in ISO format (e.g., "2024-01-01")
      const end = new Date(endMonth); // End date in ISO format (e.g., "2024-02-01")

      const monthDiff =
        end.getMonth() -
        start.getMonth() +
        12 * (end.getFullYear() - start.getFullYear());
      if (monthDiff !== 1) {
        return NextResponse.json(
          {
            error:
              "The difference between startMonth and endMonth must be exactly 1 month.",
          },
          { status: 400 }
        );
      }

      const filter = {
        status: "Completed",
        createdAt: { $gte: start, $lt: end },
      };

      const salesData = await Sales.aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            totalRevenue: {
              $sum: {
                $subtract: [
                  "$projectValue",
                  { $sum: "$expenses.amount" }, // Sum of expenses
                ],
              },
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ]);

      const formattedData = salesData.map((entry) => {
        const { year, month, day } = entry._id;
        return {
          date: `${year}-${month}-${day}`,
          revenue: entry.totalRevenue,
        };
      });

      return NextResponse.json({ data: formattedData });
    }

    const now = new Date();
    let filter = {};
    let groupBy = {};

    if (timeframe === "yearly") {
      const startOfYear = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );
      filter = { status: "Completed", createdAt: { $gte: startOfYear } };
      groupBy = {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          totalRevenue: {
            $sum: {
              $subtract: [
                "$projectValue",
                { $sum: 1000 + 1000 }, // Sum of expenses
              ],
            },
          },
        },
      };
    } else if (timeframe === "monthly") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      filter = { status: "Completed", createdAt: { $gte: startOfMonth } };
      groupBy = {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: {
            $sum: {
              $subtract: [
                "$projectValue",
                { $sum: "$expenses.amount" }, // Sum of expenses
              ],
            },
          },
        },
      };
    }

    const salesData = await Sales.aggregate([
      { $match: filter },
      groupBy,
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const formattedData = salesData.map((entry) => {
      const { year, month } = entry._id;
      console.log(entry);
      return {
        date: `${year}${month ? `-${month}` : ""}`,
        revenue: entry.totalRevenue,
      };
    });

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
};
