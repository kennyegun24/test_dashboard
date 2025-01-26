const { Schema, default: mongoose } = require("mongoose");

const faqSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: false, // Optional categorization
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", faqSchema);
module.exports = FAQ;
