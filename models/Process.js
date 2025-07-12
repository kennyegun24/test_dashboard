import mongoose, { Schema } from "mongoose";

const stepSchema = new Schema({
  stepName: { type: String, required: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const processSchema = new Schema({
  sectionHeader: {
    mainTitle: { type: String, required: true },
    subheading: { type: String, required: true },
  },
  steps: {
    type: [stepSchema],
    validate: {
      validator: function (v) {
        return v.length === 3;
      },
      message: "Exactly 3 steps are required.",
    },
  },
});

export default mongoose.models.Process ||
  mongoose.model("Process", processSchema);
