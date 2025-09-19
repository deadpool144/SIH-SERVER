import express from "express";

const router = express.Router();

import { getAllAlumni, getAlumniProfile , getRandomAlumni} from "../controllers/alumni.controller.js";

router.get("/all", getAllAlumni);
router.get("/profile/:id", getAlumniProfile);
router.get("/random", getRandomAlumni);


export default router;