const { Schema, model, models } = require("mongoose");

const testimonialSchema = new Schema(
  {
    client_name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    hashtags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial =
  models.Testimonial || model("Testimonial", testimonialSchema);

module.exports = Testimonial;
