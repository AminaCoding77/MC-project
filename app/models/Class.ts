import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  homeroomTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.models.Class || mongoose.model("Class", ClassSchema);
