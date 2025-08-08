import User from '../../models/UserModel.js/User.js';
import generateToken from '../../utils/generateToken.js';
import crypto from 'crypto';

// Utility: Send JWT via cookie + response payload
const sendTokenResponse = (user, res, statusCode = 200) => {
  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(statusCode).json({
    success: true,
    message: 'Authentication successful',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

//
// @desc    Register new user
// @route   POST /api/auth/register
//
export async function registerUser(req, res, next) {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    sendTokenResponse(user, res, 201);
  } catch (err) {
    next(err);
  }
}

//
// @desc    Login user
// @route   POST /api/auth/login
//
export async function loginUser(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, res);
  } catch (err) {
    next(err);
  }
}

//
// @desc    Logout user
// @route   POST /api/auth/logout
//
export function logoutUser(req, res) {
  res.clearCookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
}

//
// @desc    Forgot password (generate token)
// @route   POST /api/auth/forgot-password
//
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // NOTE: You should send email here with resetToken
    res.status(200).json({
      success: true,
      message: 'Reset token generated successfully',
      email,
      resetToken,
    });
  } catch (err) {
    next(err);
  }
}

//
// @desc    Reset password
// @route   POST /api/auth/reset-password
//
export async function resetPassword(req, res, next) {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
}