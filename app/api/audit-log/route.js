import connectMongoDb from "@/lib/mongodb";
import AuditLog from "@/models/LogsSchema";
import { NextResponse } from "next/server";

const userActivitiesResource = [
  "LOGO",
  "COMPANY NAME",
  "FAQ",
  "PRIVACY_POLICY",
  "TERMS_OF_SERVICE",
  "BLOG",
];

const revenueResource = "Sales";
const teamsResource = "TEAM";

export const GET = async (req) => {
  try {
    // Parse the query parameter
    const url = new URL(req.url);
    const filter = url.searchParams.get("filter");

    let query = {};
    let limit = 10; // Default limit for fetching items
    let sort = { timestamp: -1 };

    // Define the filtering logic
    if (filter === "recent") {
      query.timestamp = {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      }; // Last 7 days
      limit = 0; // Fetch all
    } else if (filter === "oldest") {
      query.timestamp = {
        $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      }; // Older than 7 days
      limit = 0; // Fetch all
    } else if (filter === "audits") {
      query.resource = { $in: userActivitiesResource };
      limit = 0; // Fetch all
    } else if (filter === "revenue") {
      query.resource = revenueResource;
      limit = 0; // Fetch all
    } else if (filter === "teams") {
      query.resource = teamsResource;
      limit = 0; // Fetch all
    }
    await connectMongoDb();
    // Fetch logs based on the query and limit
    const logs = limit
      ? await AuditLog.find(query).sort(sort).limit(limit) // Limit to 10 if no filter
      : await AuditLog.find(query).sort(sort); // Fetch all if a filter is applied

    return NextResponse.json({ data: logs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
};
