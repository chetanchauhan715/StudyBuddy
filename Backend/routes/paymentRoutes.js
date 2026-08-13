import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createOrder } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/payments/create-order" , authMiddleware, createOrder );

export default router;