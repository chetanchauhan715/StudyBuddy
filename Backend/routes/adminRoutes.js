import express from "express";
import authorize from "../middleware/authorize.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { createAnnouncement, getAdminDashboard } from "../controllers/adminController.js";
import { deleteUser, getAllUser } from "../controllers/admin/adminUsersController.js";


const router = express.Router();

router.get("/admin/dashboard" , authMiddleware , authorize("admin"), getAdminDashboard);

router.get("/admin/users" , authMiddleware , authorize("admin"),getAllUser);

router.delete("/admin/users/:id" , authMiddleware, authorize("admin"), deleteUser)

router.post("/admin/announcements" , authMiddleware, authorize("admin"), createAnnouncement)


export default router;