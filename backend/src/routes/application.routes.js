import express from "express";
import {applyForJob,updateApplication,applications} from "../controllers/application.controller.js";
import { authenticateRefreshToken,destroyRefreshToken, authenticateToken } from "../middleware/auth.middleware.js";

const router=express.Router()

router.get("/",authenticateToken,applications);
router.post("/",authenticateToken,applyForJob);
router.patch("/:id",authenticateToken,updateApplication);


export default router;