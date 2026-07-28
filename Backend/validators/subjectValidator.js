import {body , validationResult} from "express-validator";

export const subjectValidator = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Subject Name Required")
    .bail()
    .isLength({min:2})
    .withMessage("Subject must be at least 2 characters long.")
    .isLength({max:70})
    .withMessage("Subject cannot exceed 70 characters."),

    (req , res , next) =>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            });
        }

        next();
    }

];