import connectMongoDb from "@/lib/mongodb";
import Sales from "@/models/Sold";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectMongoDb();
    const getLocations = await Sales.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          status: "$_id",
        },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          count: 1,
        },
      },
    ]);

    return NextResponse.json({ data: getLocations });
  } catch (error) {
    return NextResponse.json(error);
  }
};
