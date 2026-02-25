import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import errorHandler from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import applicationRoutes from "./routes/application.routes.js";

dotenv.config();

const app = express();

// Core Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/jobs", jobRoutes)

// Global Error Handler (must be last)
app.use(errorHandler);

export default app;