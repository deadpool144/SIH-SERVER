import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    images: [{ type: String }], // multiple images URLs
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // list of users who liked
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
