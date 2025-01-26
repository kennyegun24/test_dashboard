const { Schema, default: mongoose } = require("mongoose");

const aboutMeSchema = new Schema(
  {
    header: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
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
const AboutMe =
  mongoose.models.AboutMe || mongoose.model("AboutMe", aboutMeSchema);

export default AboutMe;
