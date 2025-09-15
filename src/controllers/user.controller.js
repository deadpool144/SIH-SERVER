import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  // Exclude current user
  const users = await User.find({ _id: { $ne: req.user._id } })
    .select("firstName lastName email profilePic");

  return res.status(200).json(
    new ApiResponse(200, users, "Users fetched successfully")
  );
});
