import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Read token from cookies
    const token = req.cookies?.token;
    if (!token) {
      throw new ApiError(401, "Unauthorized: Token missing");
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded userId
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new ApiError(401, "Unauthorized: User not found");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("AuthMiddleware error:", err);
    next(new ApiError(401, "Invalid or expired token"));
  }
};
