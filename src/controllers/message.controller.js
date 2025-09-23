import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Send a message
export const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const { receiverId, text } = req.body;

  if (!receiverId || !text) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Receiver and text are required"));
  }

  const message = await Message.create({ sender: senderId, receiver: receiverId, text });

  const populated = await Message.findById(message._id)
    .populate("sender", "firstName lastName profileImage")
    .populate("receiver", "firstName lastName profileImage");

  res.status(201).json(new ApiResponse(201, populated, "Message sent"));
});

// ✅ Get conversation between two users
export const getConversation = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const { peerId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: senderId, receiver: peerId },
      { sender: peerId, receiver: senderId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender", "firstName lastName profileImage")
    .populate("receiver", "firstName lastName profileImage");

  res.status(200).json(new ApiResponse(200, messages, "Conversation fetched"));
});

// ✅ Get all chats for logged-in user (chat list)
export const getUserChats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all users except the logged-in user
  const users = await User.find({ _id: { $ne: userId } })
    .select("firstName lastName profileImage email");

  // For each user, fetch the last message (if any exists)
  const chatList = await Promise.all(
    users.map(async (peer) => {
      const lastMessage = await Message.findOne({
        $or: [
          { sender: userId, receiver: peer._id },
          { sender: peer._id, receiver: userId }
        ]
      })
      .sort({ createdAt: -1 })
      .populate("sender", "firstName lastName profileImage")
      .populate("receiver", "firstName lastName profileImage");

      return {
        peer,           // Full user info
        lastMessage,    // Last message (null if no chat yet)
      };
    })
  );

  res.status(200).json(new ApiResponse(200, chatList, "Chats fetched"));
});


// ✅ Mark messages as read
export const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { peerId } = req.params;

  await Message.updateMany(
    { sender: peerId, receiver: userId, read: false },
    { $set: { read: true } }
  );

  res.status(200).json(new ApiResponse(200, null, "Messages marked as read"));
});
