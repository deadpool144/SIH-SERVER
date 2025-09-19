import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  toggleLike,
  addComment,
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js"; // your multer config
import { authMiddleware } from "../middlewares/auth.middleware.js"; // make sure user is logged in

const router = express.Router();

// ✅ Create a new post (with multiple images)
router.post(
  "/create",
  authMiddleware,
  upload.array("images", 5), // max 5 images
  createPost
);

// ✅ Get all posts
router.get("/all", authMiddleware, getAllPosts);

// ✅ Get single post by ID
router.get("/:id", authMiddleware, getPostById);

// ✅ Like / Unlike post
router.post("/:id/like", authMiddleware, toggleLike);

// ✅ Add comment to a post
router.post("/:id/comment", authMiddleware, addComment);

export default router;
