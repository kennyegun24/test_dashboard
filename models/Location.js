import mongoose, { Schema } from "mongoose";

const countrySchema = new Schema({
  name: { type: String, unique: true }, // Unique country name
  count: { type: Number, default: 0 }, // Tracks visits from this country
  code: { type: String, unique: true }, // Country code
});

const locationSchema = new Schema(
  {
    continent: { type: String, unique: true }, // Unique continent name
    countries: [countrySchema], // Array of country objects
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Location =
  mongoose.models.Location || mongoose.model("Location", locationSchema);

export default Location;
