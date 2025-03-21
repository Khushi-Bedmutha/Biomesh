import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();  // This loads the .env file

 // adjust this path if needed

export const protect = async (req, res, next) => {
  try {
    let token;

    console.log('[DEBUG] Incoming request headers:', req.headers);

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('[DEBUG] Extracted token:', token);
    }

    if (!token) {
      console.warn('[WARN] No token found in Authorization header');
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(
      token,
      'd13b35e499e999291e295b66c36b947ba76843059ab4f92b993029283e9a05f6e5cf7a39e66726dabfba866fed5e15411c78b89a0777a7cc077deea468d609d8'
    );

    console.log('[DEBUG] Decoded JWT:', decoded);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.warn('[WARN] No user found for decoded token ID');
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('[DEBUG] Authenticated user:', req.user._id);
    next();
  } catch (error) {
    console.error('[ERROR] protect middleware error:', error.message);
    res.status(401).json({ message: 'Not authorized to access this route' });
  }
};


export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};