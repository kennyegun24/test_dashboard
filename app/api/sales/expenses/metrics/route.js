import connectMongoDb from "@/lib/mongodb";
import Sales from "@/models/Sold";
import { NextResponse } from "next/server";

const getStats = async (startDate, endDate) => {
  return Sales.aggregate([
    {
      $match: {
        status: "Completed",
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $facet: {
        revenue: [
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: {
                  $subtract: ["$projectValue", { $sum: "$expenses.amount" }],
                },
              },
            },
          },
        ],
        totalClients: [
          {
            $group: {
              _id: "$clientName",
            },
          },
          {
            $count: "count",
          },
        ],
        completedProjects: [
          {
            $count: "count",
          },
        ],
      },
    },
    {
      $project: {
        totalRevenue: { $arrayElemAt: ["$revenue.totalRevenue", 0] },
        totalClients: { $arrayElemAt: ["$totalClients.count", 0] },
        completedProjects: { $arrayElemAt: ["$completedProjects.count", 0] },
      },
    },
  ]);
};

export const GET = async () => {
  const _currentDate = new Date();
  const last30DaysDate_ = new Date(_currentDate);
  last30DaysDate_.setDate(_currentDate.getDate() - 30);

  const _previous30DaysDate = new Date(last30DaysDate_);
  _previous30DaysDate.setDate(last30DaysDate_.getDate() - 30);
  await connectMongoDb();

  try {
    const [last30DaysData, previous30DaysData] = await Promise.all([
      getStats(last30DaysDate_, _currentDate),
      getStats(_previous30DaysDate, last30DaysDate_),
    ]);
    const _last30Days = last30DaysData[0];
    const previous30Days_ = previous30DaysData[0];

    const totalClientsPercentage = {
      clientPercentage:
        ((_last30Days.totalClients - (previous30Days_.totalClients || 0)) /
          (previous30Days_.totalClients || 1)) *
        100,
    };

    const completedProjectsPercentage = {
      projectsPercentage:
        ((_last30Days.completedProjects -
          (previous30Days_.completedProjects || 0)) /
          (previous30Days_.completedProjects || 1)) *
        100,
    };

    const totalRevenuePercentage = {
      revenuePercentage:
        ((_last30Days.totalRevenue - (previous30Days_.totalRevenue || 0)) /
          (previous30Days_.totalRevenue || 1)) *
        100,
    };

    const finalLast30Days = {
      ..._last30Days,
      ...totalRevenuePercentage,
      ...completedProjectsPercentage,
      ...totalClientsPercentage,
    };
    return NextResponse.json({ data: finalLast30Days }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
