const { Schema, default: mongoose } = require("mongoose");

const AuditLogSchema = new Schema({
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  action: {
    type: String,
    required: true,
  },
  resource: {
    type: String, // The resource affected (e.g., 'Revenue', 'Team', 'FAQ')
    required: true,
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId, // ID of the affected resource, if applicable
  },
  details: {
    type: Object, // Additional data related to the action (e.g., revenue amount, user invited, etc.)
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const AuditLog =
  mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);

export default AuditLog;
