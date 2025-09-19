import Event from "../models/events.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Create Event
export const createEvent = asyncHandler(async (req, res) => {
  try {
    const { title, date, location, description } = req.body;
    const userId = req.user._id;

    if (!title || !date || !location || !description) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All fields are required"));
    }

    let imageUrl;

    // If image uploaded
    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "event_images" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const event = await Event.create({
      userId,
      title,
      date,
      location,
      description,
      ...(imageUrl && { imageUrl }),
    });

    res
      .status(201)
      .json(new ApiResponse(201, event, "Event created successfully"));
  } catch (err) {
    console.error("Error creating event:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error while creating event" });
  }
});

// ✅ Get All Events
export const getAllEvents = asyncHandler(async (req, res) => {
  try {
    const events = await Event.find()
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json(new ApiResponse(200, events, "Events fetched successfully"));
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

