import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { getStudySessions, createStudySessions, updateStudySession, removeStudySession } from "../controllers/studySessionController.js";
import { studySessionCreateValidation } from "../validators/studySessioValidator.js";


const router = express.Router();

// crud operation API 

// - create API 

// router.post("/study-sessions" , authMiddleware ,  async (req, res) => {
    

// });

router.post("/study-sessions", authMiddleware , studySessionCreateValidation, createStudySessions);

//  study session - get Api 

// router.get("/study-sessions" , authMiddleware , async (req , res) =>{
// });

router.get("/study-sessions" ,  authMiddleware,  getStudySessions);

//----- update ------ 

// router.put("/study-sessions/:id" , authMiddleware ,  async (req, res) =>{
// });

router.put("/study-sessions/:id" ,authMiddleware, studySessionCreateValidation,   updateStudySession);

// ------ delete ---

// router.delete("/study-sessions/:id" , authMiddleware ,  async (req , res) =>{
// });

router.delete("/study-sessions/:id" , authMiddleware,  removeStudySession);


// ------- export 
export default router;
