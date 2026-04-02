import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  type: {
    type: String,
    enum: ["exam", "event", "assignment"],
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  location: {
    type: String,
  },

  color: {
    type: String,
    enum: ["orange", "green", "purple", "blue"],
    default: "blue",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },

  score: {
    type: { type: String },
  },
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
