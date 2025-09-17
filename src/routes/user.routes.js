import express from 'express';

const router = express.Router();

import { upload } from '../middlewares/multer.middleware.js';

import {addOrUpdateProfile,getProfile} from '../controllers/user.controller.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';

router.get('/profile/me', authMiddleware, getProfile);
router.post('/profile/update', authMiddleware,upload.single("profileImage"),addOrUpdateProfile);

export default router;