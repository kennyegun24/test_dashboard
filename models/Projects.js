import mongoose from "mongoose";
const { Schema } = mongoose;

const feature = new Schema(
  {
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const designProcess = new Schema(
  {
    title: { type: String, required: true, trim: true },
    dets: { type: [String], default: [] },
  },
  { _id: false }
);

const projectSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["graphics", "others"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "fintech",
        "3d",
        "ui/ux",
        "e-commerce",
        "saas",
        "graphics",
        "frontend",
        "other-web",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
      validate: {
        validator: function (url) {
          return /^https?:\/\//.test(url);
        },
        message: "Image must be a valid http/https URL",
      },
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    bannerImg: {
      type: String,
      required: true,
      trim: true,
    },

    otherImgs: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          if (this.type === "graphics")
            return (
              Array.isArray(arr) &&
              arr.length >= 1 &&
              arr.every((url) => /^https?:\/\//.test(url))
            );

          return (
            Array.isArray(arr) &&
            arr.length >= 1 &&
            arr.length <= 3 &&
            arr.every((url) => /^https?:\/\//.test(url))
          );
        },
        message:
          "Images must be between 1 and 3 and must be valid http/https URLs",
      },
    },

    nickName: {
      type: String,
      required: true,
      trim: true,
    },

    overview: {
      about: {
        type: String,
        required: function () {
          return this.type !== "graphics";
        },
        trim: true,
      },
      problem: {
        type: String,
        required: function () {
          return this.type !== "graphics";
        },
        trim: true,
      },
      solution: {
        type: String,
        required: function () {
          return this.type !== "graphics";
        },
        trim: true,
      },
    },

    dProcess: {
      type: [designProcess],
      required: function () {
        return this.type !== "graphics";
      },
      default: [],
    },

    features: {
      type: [feature],
      required: function () {
        return this.type !== "graphics";
      },
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
