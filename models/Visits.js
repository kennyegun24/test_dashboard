import mongoose, { Schema } from "mongoose";

const VisitSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    totalVisits: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Visit = mongoose.models.Visit || mongoose.model("Visit", VisitSchema);

export default Visit;
