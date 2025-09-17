import mongoose from "mongoose";

const workExperienceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    experiences: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        duration: { type: String },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("WorkExperience", workExperienceSchema);
