import mongoose, { Types } from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    task_name: { type: String, required: true }, // "Product Manager"
    task_header: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    assigned_to: {
      type: Types.ObjectId,
      ref: "Teams",
      required: true,
    },
    due_date: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
