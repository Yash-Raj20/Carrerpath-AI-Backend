import jwt from 'jsonwebtoken';
import User from '../../models/UserModel.js/User.js';

const protect = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id).select('-password');
    
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token failed or expired' });
  }
};

export default protect;