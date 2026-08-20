import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { reminderCreateValidator } from "../validators/reminderValidator.js";
import { createReminder, deleteReminder, getReminders } from "../controllers/reminderController.js";


const router = express.Router();

router.post("/reminders", authMiddleware, reminderCreateValidator, createReminder);

router.get("/reminders/today-reminders", authMiddleware, getReminders);

router.delete("/reminders/delete/:reminderId" , authMiddleware, deleteReminder)

export default router;

