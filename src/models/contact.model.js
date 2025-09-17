import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    email: { type: String },
    phone: { type: String },
    linkedin: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
