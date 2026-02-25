import express from "express";
import {listjobs} from "../controllers/job.controller.js";
import { authenticateRefreshToken,destroyRefreshToken, authenticateToken } from "../middleware/auth.middleware.js";

const router=express.Router()

router.post("/",authenticateToken,listjobs);


export default router;