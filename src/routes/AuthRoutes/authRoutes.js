import { Router } from 'express';
const router = Router();

import { body } from 'express-validator';
import validate from '../../middleware/validate.js';

import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
} from '../../controllers/AuthController/authController.js';

// @route POST /api/auth/register
router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
  ],
  validate,
  registerUser
);

// @route POST /api/auth/login
router.post(
  '/login',
  [
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password is required').notEmpty(),
  ],
  validate,
  loginUser
);

router.post("/logout", logoutUser);

// @route POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  [
    body('email', 'Valid email is required').isEmail(),
  ],
  validate,
  forgotPassword
);

// @route POST /api/auth/reset-password
router.post(
  '/reset-password',
  [
    body('resetToken', 'Reset token is required').notEmpty(),
    body('newPassword', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  validate,
  resetPassword
);

export default router;