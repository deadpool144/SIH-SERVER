import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    tenth: { type: String },
    twelfth: { type: String },
    cgpa: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Education", educationSchema);
