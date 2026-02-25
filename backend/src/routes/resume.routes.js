import express from "express";
import {getResumes,createResume,updateResume,deleteResume} from "../controllers/resume.controller.js";
import { authenticateRefreshToken,destroyRefreshToken, authenticateToken } from "../middleware/auth.middleware.js";


const router=express.Router();

router.get("/",authenticateToken,getResumes);
router.post("/",authenticateToken,createResume);
router.put("/:id",authenticateToken,updateResume);
router.delete("/:id",authenticateToken,deleteResume);

export default router;