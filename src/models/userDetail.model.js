import mongoose from "mongoose";

const userDetailSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    batch: { type: String },
    department: { type: String },
    role: { type: String },
    profileImage: { type: String, default: "" }, // New field
  },
  { timestamps: true }
);

export default mongoose.model("UserDetail", userDetailSchema);
