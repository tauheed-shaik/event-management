import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    location: { type: String, default: "" },
    type: { type: String, default: "Workshop" },
    keywords: [{ type: String, trim: true }],
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
