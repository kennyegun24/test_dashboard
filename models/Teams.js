const { Schema, default: mongoose } = require("mongoose");

const TeamSchema = new Schema(
  {
    roles: {
      type: [String],
      default: ["Guest"],
      required: true,
      validate: {
        validator: function (roles) {
          return Array.isArray(roles) && new Set(roles).size === roles.length;
        },
        message: "Roles must be unique.",
      },
    },

    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      required: true,
      unique: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      match: [/^\+?[1-9]\d{1,14}$/, "Invalid contact format"],
      required: true,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    expiry_time: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Current time + 7 days
    },
  },
  { timestamps: true }
);

const Teams = mongoose.models.Teams || mongoose.model("Teams", TeamSchema);

export default Teams;
