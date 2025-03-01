import { NextResponse } from "next/server";
import Teams from "@/models/Teams";
import Task from "@/models/Tasks";
import connectMongoDb from "@/lib/mongodb";
import { startOfMonth, startOfWeek, subMonths } from "date-fns";

export const GET = async (req, res) => {
  try {
    const range = req.nextUrl.searchParams.get("range");
    console.log(range);
    let filter = {};

    const now = new Date();
    if (range === "weekly") {
      filter.createdAt = { $gte: startOfWeek(now) };
    } else if (range === "last_month") {
      filter.createdAt = { $gte: startOfMonth(subMonths(now, 1)) };
    } else if (range === "last_3months") {
      filter.createdAt = { $gte: subMonths(now, 3) };
    } else if (range === "last_6months") {
      filter.createdAt = { $gte: subMonths(now, 6) };
    }
    await connectMongoDb();

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate("assigned_to", "full_name");
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .populate("assigned_to", "full_name")
      .limit(3);
    return NextResponse.json({ recentTasks, allTasks: tasks }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
};

export const POST = async (req, res) => {
  const body = await req.json();
  const {
    task_name,
    task_header,
    priority,
    assigned_to,
    due_date,
    description,
  } = await body;
  try {
    await connectMongoDb();
    const newTask = new Task({
      task_name,
      task_header,
      priority,
      assigned_to,
      due_date,
      description,
    });
    const save = await newTask.save();
    return NextResponse.json({});
  } catch (error) {
    console.log(error);
    return NextResponse.json({});
  }
};
``;
