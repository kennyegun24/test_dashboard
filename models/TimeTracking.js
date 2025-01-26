import mongoose, { Schema } from "mongoose";

const TimeTrackingSchema = new Schema({
  duration: { type: Number, required: true }, // Duration in seconds
  timestamp: { type: Date, default: Date.now }, // Automatically track when the data was saved
});

const TimeTracking =
  mongoose.models.TimeTracking ||
  mongoose.model("TimeTracking", TimeTrackingSchema);

export default TimeTracking;
