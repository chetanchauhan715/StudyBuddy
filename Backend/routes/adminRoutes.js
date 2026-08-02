import express from "express";
import authorize from "../middleware/authorize.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAdminDashboard } from "../controllers/adminController.js";


const router = express.Router();

router.get("/admin/dashboard" , authMiddleware , authorize("admin"), getAdminDashboard);

export default router;