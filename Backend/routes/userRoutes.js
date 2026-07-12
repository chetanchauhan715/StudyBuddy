import expres from "express";
// import bcrypt from "bcrypt";
// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
import { login, signup } from "../controllers/userController.js";
import { loginValidator, signupValidator } from "../validators/userValidator.js";


const router = expres.Router();


// ------ sign up API --------
router.post("/signup" , signupValidator, signup);
router.post("/login" , loginValidator,login);



// --------------- login API --------
// router.post("/login" , async (req, res) =>{

    
// });

// - ----------- ---------- export
export default router;