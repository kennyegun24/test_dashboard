const { Schema, default: mongoose } = require("mongoose");

const contentSchema = new Schema(
  {
    logo: {
      type: String,
      required: true,
    },
    company_name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    socials: [
      {
        platform: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Export the schema
const Content =
  mongoose.models.Contents || mongoose.model("Contents", contentSchema);

export default Content;
