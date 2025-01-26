const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    serviceRequired: {
      type: String,
      required: true,
    },
    projectValue: {
      type: Number,
      required: true,
      min: 0,
    },
    expenses: {
      type: [
        {
          amount: {
            type: Number,
            required: true,
          },
          expense: {
            type: String,
            required: true,
            default: "Others",
            enum: [
              "Others",
              "Web Development",
              "Web Designer",
              "Graphics Designer",
              "Hosting",
              "Domain Name",
              "3D Designer",
            ],
          },
        },
      ],
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    additionalNote: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sales = mongoose.models.Sales || mongoose.model("Sales", salesSchema);

export default Sales;
