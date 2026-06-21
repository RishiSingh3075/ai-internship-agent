import express from "express";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {aiIntegration, parseResume, matchJobs,generatecoverletter,matchJobsSemantic} from "../controllers/ai.controller.js";

const router=express.Router();
router.get("/test",aiIntegration);
router.post("/",authenticateToken,parseResume)
router.post("/match-jobs",authenticateToken,matchJobs)
router.post("/generate-cover-letter",authenticateToken,generatecoverletter)
router.post('/semanticmatchjobs', authenticateToken, matchJobsSemantic)
export default router;
