import express from "express";

const router = express.Router();

import { getAllAlumni, getAlumniProfile } from "../controllers/alumni.controller.js";

router.get("/all", getAllAlumni);
router.get("/profile/:id", getAlumniProfile);


export default router;