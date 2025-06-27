import { Router } from "express";
const router = Router();
import protect from "../middleware/AuthMiddleware/auth.js";
import { recommendCourses } from "../controllers/courseController.js";

router.post("/recommend", protect, recommendCourses);

export default router;