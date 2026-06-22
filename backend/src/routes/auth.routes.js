import express from "express";
import { registerUser, loginUser,listjobs,applyForJob} from "../controllers/auth.controller.js";
import { authenticateRefreshToken,destroyRefreshToken, authenticateToken } from "../middleware/auth.middleware.js";
import { generateToken } from "../utils/generateToken.js";
import { registerValidator,loginValidator } from "../validators/auth.validator.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();

router.post("/register", registerValidator,validate,registerUser);
router.post("/jobs",authenticateToken,listjobs);
// router.post("/jobs",  listjobs);
router.post("/login", loginValidator,validate,loginUser);
router.post("/token",authenticateRefreshToken,generateToken);
router.get("/dashboard", authenticateToken);
router.post('/logout',authenticateToken,destroyRefreshToken);
// router.post('/apply',authenticateToken,applyForJob);
router.post('/apply',applyForJob);
router.get("/me",authenticateToken,(req,res)=>{
    res.json(
        {
            success:true,
            user:req.user
        }
    )
})
// router.get("/jobs",authenticateToken,listjobs);

export default router;