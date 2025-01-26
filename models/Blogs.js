const { Schema, default: mongoose } = require("mongoose");

const blogSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    short_summary: {
      type: String,
      required: true,
      trim: true,
    },
    cover_image: {
      type: String,
      required: true,
      trim: true,
      default:
        "https://res.cloudinary.com/drfqge33t/image/upload/v1696797490/asset22_lc0gs6.jpg",
    },
    docs: {
      type: String,
      required: false,
      trim: true,
    },
    meta_page_title: {
      type: String,
      required: true,
      trim: true,
    },
    meta_desc: {
      type: String,
      required: true,
      trim: true,
    },
    key_tags: {
      type: String,
      required: true,
      trim: true,
    },
    meta_keywords: { type: String, trim: true, required: true },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
module.exports = Blog;
