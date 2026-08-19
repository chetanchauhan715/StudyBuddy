import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { testPushNotification } from "../controllers/pushController.js";

import {
    getVapidPublicKey,
    savePushSubscription
} from "../controllers/pushController.js";

import {
    pushSubscriptionValidator
} from "../validators/pushSubscriptionValidator.js";


const router = express.Router();


router.get(
    "/push/public-key",
    getVapidPublicKey
);


router.post(
    "/push/subscribe",
    authMiddleware,
    pushSubscriptionValidator,
    savePushSubscription
);


router.post(
    "/push/test",
    authMiddleware,
    testPushNotification
);

export default router;