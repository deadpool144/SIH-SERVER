import express from "express";
import {
  sendMessage,
  getConversation,
  getUserChats,
  markAsRead,
} from "../controllers/message.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send", authMiddleware, sendMessage); // send message
router.get("/conversation/:peerId", authMiddleware, getConversation); // chat with specific user
router.get("/all", authMiddleware, getUserChats); // all chat list
router.put("/read/:peerId", authMiddleware, markAsRead); // mark conversation as read

export default router;
