const { Schema, default: mongoose } = require("mongoose");

const privacy_policy_schema = new Schema(
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
const PrivacyPolicy =
  mongoose.models.PrivacyPolicy ||
  mongoose.model("PrivacyPolicy", privacy_policy_schema);

export default PrivacyPolicy;
