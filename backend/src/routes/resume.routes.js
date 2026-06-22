import express from "express";
import {getResumes,createResume,updateResume,deleteResume} from "../controllers/resume.controller.js";
import { authenticateRefreshToken,destroyRefreshToken, authenticateToken } from "../middleware/auth.middleware.js";
import { createResumeValidator, updateResumeValidator, deleteResumeValidator } from '../validators/resume.validator.js';
import { validate } from '../middleware/validate.js';


const router=express.Router();

router.get("/",authenticateToken,getResumes);
router.post('/', authenticateToken, createResumeValidator, validate, createResume);
router.put('/:id', authenticateToken, updateResumeValidator, validate, updateResume);
router.delete('/:id', authenticateToken, deleteResumeValidator, validate, deleteResume);

export default router;