import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import premiumMiddleware from "../middleware/premiumMiddleware.js";

import { changePassword, getProfile , forgotPassword, updateProfile, resetPassword, updateWeeklyGoal} from "../controllers/profileController.js";

const router = express.Router();

router.get("/profile" , authMiddleware , getProfile);

router.put("/profile" , authMiddleware , updateProfile);

router.put("/change-password" , authMiddleware, changePassword);

router.post("/forgot-password" , forgotPassword);

router.put("/reset-password" , resetPassword);


router.put("/profile/weekly-goal", authMiddleware, premiumMiddleware, updateWeeklyGoal)

export default router;