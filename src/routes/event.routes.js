import express from "express";
import { createEvent, getAllEvents,} from "../controllers/event.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();


router.post("/create", authMiddleware,upload.single("image"), createEvent);


router.get("/all", getAllEvents);

export default router;
