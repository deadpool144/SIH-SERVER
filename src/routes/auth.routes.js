import express from "express";

const router = express.Router();
import { RegisterUser, LoginUser, LogoutUser } from "../controllers/auth.controller.js";  

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/logout", LogoutUser);

export default router;
