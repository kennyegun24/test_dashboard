import connectMongoDb from "@/lib/mongodb";
import Visit from "@/models/Visits";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req, res) => {
  try {
    await connectMongoDb();
    const timeframe = req.nextUrl.searchParams.get("timeframe");

    const validTimeframes = ["yearly", "monthly"];
    if (!timeframe || !validTimeframes.includes(timeframe)) {
      return NextResponse.json(
        {
          error:
            "Invalid or missing timeframe parameter. Use yearly, monthly, or daily.",
        },
        { status: 400 }
      );
    }

    const now = new Date();
    let filter = {};
    let groupBy = {};
    let visits = [];

    if (timeframe === "yearly") {
      const startOfYear = new Date(now.getFullYear() - 1, 0, 1);
      filter = { createdAt: { $gte: startOfYear } };
      groupBy = [
        {
          $group: {
            _id: "$year",
            totalVisits: { $sum: "$totalVisits" },
          },
        },
        {
          $addFields: {
            type: "yearly",
          },
        },
      ];
      visits = await Visit.aggregate([{ $match: filter }, ...groupBy]);
      return NextResponse.json(visits, { status: 200 });
    } else if (timeframe === "monthly") {
      const selectedYear = await req.nextUrl.searchParams.get("year");
      filter = { year: Number(selectedYear) };

      groupBy = {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalVisits: { $sum: "$totalVisits" },
        },
      };

      visits = await Visit.aggregate([{ $match: filter }, groupBy]);

      // Fill missing months for each year
      const filledVisits = [];
      const monthsInYear = Array.from({ length: 12 }, (_, i) => i + 1); // Months 1-12

      // Iterate over each year in the visits data
      const yearsInData = Array.from(new Set(visits.map((v) => v._id.year)));
      const yearsToInclude = selectedYear
        ? [parseInt(selectedYear)]
        : yearsInData.length > 0
        ? yearsInData
        : [now.getFullYear()];

      yearsToInclude.forEach((year) => {
        const yearVisits = visits.filter((v) => v._id.year === year);
        monthsInYear.forEach((month) => {
          const visitForMonth = yearVisits.find((v) => v._id.month === month);
          filledVisits.push({
            _id: month, // Use the month as the `_id`
            totalVisits: visitForMonth ? visitForMonth.totalVisits : 0,
            type: "monthly",
          });
        });
      });

      return NextResponse.json(filledVisits, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
};
