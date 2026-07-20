import {body , validationResult} from "express-validator";

export const studySessionCreateValidation = [
    body("subject")
    .notEmpty()
    .withMessage("Subject Required")
    .bail()
    .isLength({min:2})
    .withMessage("Subject length must Atltes 2 character")
    .isLength({max:70})
    .withMessage("Subject length must not exceeds 70 characters"),

    body("topic")
    .optional({values:"falsy"})
    .isLength({min:2})
    .withMessage("Topic length reuired atlest 2 characters")
    .isLength({max:70})
    .withMessage("Topic length must not exceeds 70 characters"),

    body("duration")
    .notEmpty()
    .withMessage("Duration Required")
    .bail()
    .isInt({min:15 , max:720})
    .withMessage("Duration must between 15 minutes and 12 hours") , 

    body("status")
    .notEmpty()
    .withMessage("Status Required")
    .isIn(["Pending" , "Completed"])
    .withMessage("Invalid Status"),
    


    (req , res , next) =>{
        const error = validationResult(req);

        if(!error.isEmpty()){
            return res.status(400).json({
                error:error.array()
            });
        }
        
        next();
    }


];