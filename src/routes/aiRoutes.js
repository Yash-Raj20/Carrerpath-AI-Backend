import express from 'express';
import { startMockInterview } from '../controllers/mockInterviewController.js';
import { generateRoadmap } from '../controllers/roadmapController.js';
import protect from './../middleware/AuthMiddleware/auth.js';
import { evaluateAnswer } from '../controllers/evaluateAnswer.js';

const router = express.Router();

router.post('/mock-interview', protect, startMockInterview);
router.post('/roadmap', protect, generateRoadmap);
router.post("/evaluate-answer", protect, evaluateAnswer);

export default router;