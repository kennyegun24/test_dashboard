import connectMongoDb from "@/lib/mongodb";
import Location from "@/models/Location";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectMongoDb();
    const getLocations = await Location.aggregate([
      {
        $unwind: "$countries",
      },
      {
        $group: {
          _id: "$continent",
          count: {
            $sum: "$countries.count",
          },
        },
      },
      {
        $addFields: {
          continent: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
          continent: 1,
          count: 1,
        },
      },
    ]);

    return NextResponse.json({ data: getLocations });
  } catch (error) {
    return NextResponse.json(error);
  }
};
