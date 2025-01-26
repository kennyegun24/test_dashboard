const { Schema, default: mongoose } = require("mongoose");

const terms_of_service_schema = new Schema(
  {
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
const TermsOfService =
  mongoose.models.TermsOfService ||
  mongoose.model("TermsOfService", terms_of_service_schema);

export default TermsOfService;
