import UserDetail from "../models/userDetail.model.js";
import Contact from "../models/contact.model.js";
import Education from "../models/education.model.js";
import Skill from "../models/skill.model.js";
import WorkExperience from "../models/workExperience.model.js";
import User from "../models/user.model.js";
import Contribution from "../models/contribution.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

dotenv.config();

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user= await User.find({_id:userId})
  const profile = await UserDetail.findOne({ userId });
  const contact = await Contact.findOne({ userId });
  const education = await Education.findOne({ userId });
  const skillsDoc = await Skill.findOne({ userId });
  const workExperienceDoc = await WorkExperience.findOne({ userId });
  const contribution = await Contribution.findOne({ userId });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        profile,
        contact,
        education,
        skills: skillsDoc?.skills || [],
        workExperience: workExperienceDoc?.experiences || [],
        contribution,
      },
      "Profile fetched successfully"
    )
  );
});

export const addOrUpdateProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      batch,
      department,
      role,
      email,
      phone,
      linkedin,
      location,
      tenth,
      twelfth,
      cgpa,
      skills,
      workExperience,
      mentorship,
      donation,
      lastDonation,
      totalDonations,
      eventsAttended,
      leaderRank,
    } = req.body;

    let profileImageUrl;

    //  Upload image if present
    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "profile_images" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);
      profileImageUrl = result.secure_url;
    }

    //  Update or create UserDetail
    const userDetail = await UserDetail.findOneAndUpdate(
      { userId },
      { batch, department, role, ...(profileImageUrl && { profileImage: profileImageUrl }) },
      { new: true, upsert: true }
    );

    //  Update or create Contact
    const contact = await Contact.findOneAndUpdate(
      { userId },
      { email, phone, linkedin, location },
      { new: true, upsert: true }
    );

    //  Update or create Education
    const education = await Education.findOneAndUpdate(
      { userId },
      { tenth, twelfth, cgpa },
      { new: true, upsert: true }
    );

    //  Update Skills (as array in single doc)
    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : JSON.parse(skills);
      await Skill.findOneAndUpdate(
        { userId },
        { skills: skillArray },
        { new: true, upsert: true }
      );
    }

    //  Update Work Experience (as array in single doc)
    if (workExperience) {
      const workArray = Array.isArray(workExperience) ? workExperience : JSON.parse(workExperience);
      await WorkExperience.findOneAndUpdate(
        { userId },
        { experiences: workArray },
        { new: true, upsert: true }
      );
    }

    //  Update or create Contribution
    const contribution = await Contribution.findOneAndUpdate(
      { userId },
      { mentorship, donation, lastDonation, totalDonations, eventsAttended, leaderRank },
      { new: true, upsert: true }
    );

    res.status(200).json(
      new ApiResponse(
        200,
        { userDetail, contact, education, contribution },
        "Profile saved successfully"
      )
    );
  } catch (err) {
    console.error("Profile update failed:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
