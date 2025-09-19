import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import UserDetail from "../models/userDetail.model.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// --- Helper for Cloudinary Upload ---
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "posts" },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// --- Helper: attach profileImage ---
const attachProfileImage = async (user) => {
  const detail = await UserDetail.findOne({ userId: user._id }).lean();
  return {
    ...user.toObject(),
    profileImage: detail?.profileImage || null,
  };
};

// ✅ Create Post
export const createPost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { description } = req.body;

  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    imageUrls = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );
  }

  const post = await Post.create({
    userId,
    description,
    images: imageUrls,
  });

  res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

// ✅ Get All Posts (with comments + profile images)
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("userId", "firstName lastName email")
    .sort({ createdAt: -1 });

  const postsWithDetails = await Promise.all(
    posts.map(async (post) => {
      const authorWithProfile = await attachProfileImage(post.userId);

      const comments = await Comment.find({ postId: post._id })
        .populate("userId", "firstName lastName email");

      const commentsWithProfile = await Promise.all(
        comments.map(async (c) => ({
          ...c.toObject(),
          userId: await attachProfileImage(c.userId),
        }))
      );

      return {
        ...post.toObject(),
        userId: authorWithProfile,
        comments: commentsWithProfile,
      };
    })
  );

  res
    .status(200)
    .json(new ApiResponse(200, postsWithDetails, "Posts fetched successfully"));
});

// ✅ Get Single Post
export const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id).populate("userId", "firstName lastName email");
  if (!post) {
    return res.status(404).json(new ApiResponse(404, null, "Post not found"));
  }

  const authorWithProfile = await attachProfileImage(post.userId);

  const comments = await Comment.find({ postId: id })
    .populate("userId", "firstName lastName email");

  const commentsWithProfile = await Promise.all(
    comments.map(async (c) => ({
      ...c.toObject(),
      userId: await attachProfileImage(c.userId),
    }))
  );

  res.status(200).json(
    new ApiResponse(
      200,
      { ...post.toObject(), userId: authorWithProfile, comments: commentsWithProfile },
      "Post fetched successfully"
    )
  );
});

// ✅ Like/Unlike Post
export const toggleLike = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json(new ApiResponse(404, null, "Post not found"));
  }

  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter((uid) => uid.toString() !== userId.toString());
  } else {
    post.likes.push(userId);
  }

  await post.save();
  res.status(200).json(new ApiResponse(200, post, "Like status updated"));
});

// ✅ Add Comment
export const addComment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params; // postId
  const { text } = req.body;

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json(new ApiResponse(404, null, "Post not found"));
  }

  const comment = await Comment.create({
    postId: id,
    userId,
    text,
  });

  const populatedComment = await Comment.findById(comment._id).populate(
    "userId",
    "firstName lastName email"
  );

  res.status(201).json(
    new ApiResponse(201, {
      ...populatedComment.toObject(),
      userId: await attachProfileImage(populatedComment.userId),
    }, "Comment added")
  );
});

// ✅ Delete Post (owner only)
export const deletePost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json(new ApiResponse(404, null, "Post not found"));
  }

  if (post.userId.toString() !== userId.toString()) {
    return res.status(403).json(new ApiResponse(403, null, "Unauthorized to delete this post"));
  }

  await Comment.deleteMany({ postId: id }); // clean up comments
  await post.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
});
