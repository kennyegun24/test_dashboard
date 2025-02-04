import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // "Product Manager"
    permissions: [
      {
        type: String,
        enum: [
          "VIEW_TEAMS",
          "MANAGE_TEAMS",
          "EDIT_PERMISSIONS",
          "CREATE_PERMISSIONS",
          "EDIT_PRIVACY_POLICY",
          "EDIT_TERMS_CONDITIONS",
          "WRITE_BLOG",
          "SERVICES",
          "REVIEWS",
          "COMPANY_CONTENT",
          "SOCIAL_MEDIA",
          "LEADS",
          "VIEW_CALENDAR",
          "CREATE_TASK",
          "SALES",
          "ADD_NEW_SALES_RECORDS",
        ],
        default: "VIEW_TEAMS",
      },
    ], // List of permissions
    type: {
      type: String,
      enum: ["DEFAULT", "CUSTOM"],
    },
    color: {
      type: String,
      required: true,
      default: "yellow",
    },
  },
  { timestamps: true }
);

const Role = mongoose.models.Role || mongoose.model("Role", RoleSchema);

export default Role;
