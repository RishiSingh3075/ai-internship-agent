import express from "express";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {aiIntegration, parseResume} from "../controllers/ai.controller.js";

const router=express.Router();
router.get("/test",aiIntegration);
router.post("/",authenticateToken,parseResume)
export default router;
