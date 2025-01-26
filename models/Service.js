const { Schema, default: mongoose } = require("mongoose");

const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    short_desc: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Export the schema
const Service =
  mongoose.models.Services || mongoose.model("Services", serviceSchema);

export default Service;
