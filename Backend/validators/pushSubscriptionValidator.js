import { body, validationResult } from "express-validator";

export const pushSubscriptionValidator = [

    body("endpoint")
        .notEmpty()
        .withMessage("Push endpoint required"),

    body("keys.p256dh")
        .notEmpty()
        .withMessage("p256dh key required"),

    body("keys.auth")
        .notEmpty()
        .withMessage("Auth key required"),

    (req, res, next) => {

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({
                error: error.array()
            });
        }

        next();
    }
];