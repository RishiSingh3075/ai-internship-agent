import express from "express";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {aiIntegration, parseResume, matchJobs,generatecoverletter} from "../controllers/ai.controller.js";

const router=express.Router();
router.get("/test",aiIntegration);
router.post("/",authenticateToken,parseResume)
router.post("/match-jobs",authenticateToken,matchJobs)
router.post("/generate-cover-letter",authenticateToken,generatecoverletter)
export default router;
