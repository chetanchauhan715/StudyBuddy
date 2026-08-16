import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { reminderCreateValidator } from "../validators/reminderValidator.js";
import { createReminder } from "../controllers/reminderController.js";


const router = express.Router();

router.post("/reminders", authMiddleware, reminderCreateValidator, createReminder);

export default router;