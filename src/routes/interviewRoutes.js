import { Router } from "express";
const router = Router();
import { startInterview } from "../controllers/interviewController.js";
import protect from './../middleware/AuthMiddleware/auth.js';

router.post("/start", protect, startInterview);

export default router;