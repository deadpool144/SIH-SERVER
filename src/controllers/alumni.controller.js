import UserDetail from "../models/userDetail.model.js";
import Contact from "../models/contact.model.js";
import Education from "../models/education.model.js";
import Skill from "../models/skill.model.js";
import WorkExperience from "../models/workExperience.model.js";
import User from "../models/user.model.js";
import Contribution from "../models/contribution.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🔹 Get all alumni
export const getAllAlumni = asyncHandler(async (req, res) => {
  try {
    const userDetails = await UserDetail.find()
      .populate("userId", "firstName lastName email")
      .lean();

    const alumni = await Promise.all(
      userDetails.map(async (detail) => {
        const userId = detail.userId._id;

        const contact = await Contact.findOne({ userId }).lean();
        const education = await Education.findOne({ userId }).lean();
        const skillsDoc = await Skill.findOne({ userId }).lean();
        const workExperienceDoc = await WorkExperience.findOne({ userId }).lean();
        const contribution = await Contribution.findOne({ userId }).lean();

        return {
          _id: userId,
          user: detail.userId,
          profile: detail,
          contact,
          education,
          skills: skillsDoc?.skills || [],           // ✅ array of strings
          workExperience: workExperienceDoc?.experiences || [], // ✅ array of jobs
          contribution,
        };
      })
    );

    res
      .status(200)
      .json(new ApiResponse(200, alumni, "Alumni fetched successfully"));
  } catch (err) {
    console.error("Error fetching alumni:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 🔹 Get single alumni by ID
export const getAlumniProfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("firstName lastName email")
      .lean();
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "User not found"));
    }

    const profile = await UserDetail.findOne({ userId: id }).lean();
    const contact = await Contact.findOne({ userId: id }).lean();
    const education = await Education.findOne({ userId: id }).lean();
    const skillsDoc = await Skill.findOne({ userId: id }).lean();
    const workExperienceDoc = await WorkExperience.findOne({ userId: id }).lean();
    const contribution = await Contribution.findOne({ userId: id }).lean();

    const result = {
      user,
      profile,
      contact,
      education,
      skills: skillsDoc?.skills || [],
      workExperience: workExperienceDoc?.experiences || [],
      contribution,
    };

    res
      .status(200)
      .json(new ApiResponse(200, result, "Profile fetched successfully"));
  } catch (err) {
    console.error("Error fetching alumni profile:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
