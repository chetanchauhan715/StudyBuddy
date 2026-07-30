import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import { changePassword, getProfile , updateProfile} from "../controllers/profileController.js";

const router = express.Router();

router.get("/profile" , authMiddleware , getProfile);

router.put("/profile" , authMiddleware , updateProfile);

router.put("/change-password" , authMiddleware, changePassword)

export default router;