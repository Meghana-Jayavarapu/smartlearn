// backend/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function auth(req, res, next) {
  try {
    // support both Authorization header and cookie token
    const authHeader = req.headers['authorization'] || '';
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;
    const token = tokenFromHeader || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (verifyErr) {
      console.error('JWT verify error:', verifyErr);
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // decoded should contain userId (based on your User.generateToken implementation)
    const userId = decoded?.userId || decoded?.id || decoded?._id;
    if (!userId) {
      console.error('Token missing userId payload:', decoded);
      return res.status(401).json({ message: 'Token payload invalid' });
    }

    const userDoc = await User.findById(userId).select('-password').lean();
    if (!userDoc) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach a compact user object for route handlers (and keep full doc if needed)
    req.user = {
      userId: String(userDoc._id),
      id: String(userDoc._id),       // backwards-compatible key
      role: userDoc.role,
      email: userDoc.email,
      full: userDoc,
    };

    return next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ message: 'Server error in auth' });
  }
}
