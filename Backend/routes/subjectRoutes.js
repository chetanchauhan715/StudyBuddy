import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { subjectValidator } from "../validators/subjectValidator.js";

import { createSubject , getSubjects , editSubject , deleteSubject } from "../controllers/subjectController.js";


const router = express.Router();

router.post("/subjects" , authMiddleware , subjectValidator , createSubject);

router.get("/subjects" , authMiddleware , getSubjects);

router.put("/subjects/:id" , authMiddleware , subjectValidator , editSubject);

router.delete("/subjects/:id", authMiddleware, deleteSubject);

export default router;