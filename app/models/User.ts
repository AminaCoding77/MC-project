import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["student", "teacher"], required: true },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  enrolledClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  subject: { type: String, default: null },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
