import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const RegisterUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure:true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
      "User registered successfully"
    )
  );
});


export const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid email or password");
  }

  const token = jwt.sign(
    { firstName: user.firstName, lastName: user.lastName, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure:true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      "Logged in successfully"
    )
  );
});


export const LogoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});


export const checkAuth = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
          },
        },
        "User authenticated successfully"
      )
    );
  } catch (err) {
    console.error("Auth Check Error:", err.message);
    throw new ApiError(401, "Unauthorized: Invalid or expired token");
  }
});
