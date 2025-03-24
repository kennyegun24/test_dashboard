const { Schema, default: mongoose } = require("mongoose");

const reviewSchema = new Schema(
  {
    clientName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    clientImage: {
      type: String,
      required: false,
      trim: true,
    },
    clientReview: {
      type: String,
      required: false,
    },
    hashtags: {
      type: [String],
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Export the schema
const Review =
  mongoose.models.Reviews || mongoose.model("Reviews", reviewSchema);

export default Review;
