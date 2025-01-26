const { Schema, default: mongoose } = require("mongoose");

const appointmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    country: {
      type: String,
      required: false,
      trim: true,
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endTime: {
      type: Date,
      required: false,
    },
    additional_info: {
      type: String,
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
const Appointment =
  mongoose.models.Appointments ||
  mongoose.model("Appointments", appointmentSchema);

export default Appointment;
