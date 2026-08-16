import { body , validationResult } from "express-validator";

export const reminderCreateValidator = [

    body("title")
    .notEmpty()
    .withMessage("Title required")
    .bail()
    .isLength({min:2})
    .withMessage("Reminder length must Atltes 2 character")
    .isLength({max:70})
    .withMessage("Reminder length must not exceeds 70 characters"),


    body("scheduledAt")
    .notEmpty()
    .withMessage("Time required")
    .bail()
    .isISO8601()
    .bail()
    .custom((value) => {

    const scheduledDate = new Date(value);
    const currentDate = new Date();

    console.log("Scheduled:", scheduledDate);
    console.log("Current:", currentDate);
    console.log("Is past:", scheduledDate <= currentDate);

    if (scheduledDate <= currentDate) {
        throw new Error("Reminder time must be in the future");
    }

    return true;
}),


(req , res , next )=>{

        const error = validationResult(req);
        
        if(!error.isEmpty()){
            return res.status(400).json({
                error:error.array()
            });
        }
        next();
    }

    
]