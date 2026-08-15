import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createOrder , verifyPayment , handleWebhook } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/payments/create-order" , authMiddleware, createOrder );

router.post("/payments/verify-order" , authMiddleware, verifyPayment);

router.post("/payments/webhook", handleWebhook);

export default router;