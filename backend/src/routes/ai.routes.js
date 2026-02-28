import express from "express";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {aiIntegration, parseResume, matchJobs} from "../controllers/ai.controller.js";

const router=express.Router();
router.get("/test",aiIntegration);
router.post("/",authenticateToken,parseResume)
router.post("/match-jobs",authenticateToken,matchJobs)
export default router;
