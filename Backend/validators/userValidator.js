import {body , validationResult} from "express-validator";

export const signupValidator = [
    body("name")
    .notEmpty()
    .withMessage("Name is Required"),

    body("email")
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Please Enter Valid email"),

    body("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength( {min:8})
    .withMessage("Password must be atlest 8 characters "),



    (req , res , next ) => {
        const error = validationResult(req);

        if(!error.isEmpty()){
            return res.status(400).json( {
                success:false,
                message:error.array()[0].msg
    });
}

        next();
    }
];

export const loginValidator = [
    body("email")
    .notEmpty()
    .withMessage("Email is Required")
    .bail()
    .isEmail()
    .withMessage("Enter Valid Email"),

    body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength( {min :8})
    .withMessage("Password must be atlest 8 characters"),

    (req , res, next) => {
        const error = validationResult(req);

        if(!error.isEmpty()){
            return res.status(400).json({
                success:false,
                message:error.array()[0].msg
            });
        }
        next();
    }
];

