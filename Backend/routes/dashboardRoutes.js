import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import premiumMiddleware from "../middleware/premiumMiddleware.js";

import { getDashboard, getPremiumDashboardInsights } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/dashboard" , authMiddleware , getDashboard);

router.get("/dashboard/premium-insights", authMiddleware, premiumMiddleware, getPremiumDashboardInsights);

// router.get("/premium-test" , 
//     authMiddleware,
//     premiumMiddleware,
//      (req , res)=>{
//         return res.status(200).json({
//             success:true,
//             message:"preimium access granted"
//         });
//      }
// );

export default router;