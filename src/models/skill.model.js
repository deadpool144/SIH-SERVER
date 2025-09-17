import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    skills: [{ type: String, required: true }], // Array of skills
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
