import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    mentorship: { type: Boolean, default: false },
    donation: { type: Boolean, default: false },
    lastDonation: { type: String },
    totalDonations: { type: String },
    eventsAttended: { type: Number, default: 0 },
    leaderRank: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Contribution", contributionSchema);
