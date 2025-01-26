import connectMongoDb from "@/lib/mongodb";
import TimeTracking from "@/models/TimeTracking";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  try {
    await connectMongoDb();
    const { duration } = await req.json();

    if (!duration) {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
      });
    }

    // Save duration data to your database
    const timeRecord = new TimeTracking({ duration });
    await timeRecord.save();

    return new Response(
      JSON.stringify({ message: "Duration saved successfully" }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const dynamic = "force-dynamic";

export const GET = async () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 2);

  try {
    await connectMongoDb();
    const timeTracks = await TimeTracking.aggregate([
      {
        $match: {
          timestamp: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          duration: 1,
        },
      },
      {
        $group: {
          _id: "$day",
          minDuration: { $min: "$duration" },
          maxDuration: { $max: "$duration" },
          average: {
            $avg: "$duration",
          },
        },
      },
    ]);
    const fullDateRange = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      fullDateRange.push(currentDate.toISOString().split("T")[0]); // Format as "YYYY-MM-DD"
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Step 4: Fill missing dates with zeros
    const result = fullDateRange.map((date) => {
      const track = timeTracks.find((t) => t._id === date);
      return {
        day: date,
        minDuration: track ? track.minDuration : 0,
        maxDuration: track ? track.maxDuration : 0,
        average: track ? track.average : 0,
      };
    });

    return NextResponse.json(result);
  } catch (error) {}
};
