import { Router } from 'express';
import { getUserProfile, updateUserProfile, getDashboard } from '../../controllers/UserController/userController.js';
import protect from '../../middleware/AuthMiddleware/auth.js';

const router = Router();


// @route GET /api/auth/profile
router.get('/profile', protect, getUserProfile);

// @route PUT /api/auth/profile
router.put('/update-profile', protect, updateUserProfile);

// @route GET /api/auth/dashboard
router.get("/dashboard", protect, getDashboard);

export default router;