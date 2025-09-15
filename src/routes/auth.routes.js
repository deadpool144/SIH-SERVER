import express from "express";

const router = express.Router();
import { RegisterUser, LoginUser, LogoutUser, checkAuth } from "../controllers/auth.controller.js";  
import { authMiddleware } from "../middlewares/auth.middleware.js";

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/logout", LogoutUser);
router.get('/check-auth',checkAuth);

export default router;
