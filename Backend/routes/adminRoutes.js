import express from "express";
import authorize from "../middleware/authorize.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAdminDashboard } from "../controllers/adminController.js";
import { getAllUser } from "../controllers/admin/adminUsersController.js";


const router = express.Router();

router.get("/admin/dashboard" , authMiddleware , authorize("admin"), getAdminDashboard);

router.get("/admin/users" , authMiddleware , authorize("admin"),getAllUser);


export default router;