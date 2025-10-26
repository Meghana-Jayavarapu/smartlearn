// backend/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// Helper to create token
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// --- REGISTER ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: 'Email is already registered' });

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role || 'student',
      enrolledCourses: []
    });

    await user.save();

    const token = createToken(user._id);
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrolledCourses: user.enrolledCourses
    };

    return res.status(201).json({ user: safeUser, token });
  } catch (err) {
    console.error('Register route error:', err);
    if (err?.code === 11000) return res.status(400).json({ message: 'Email already registered' });
    if (err?.name === 'ValidationError') return res.status(400).json({ message: err.message });
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken(user._id);
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrolledCourses: user.enrolledCourses
    };

    return res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Login route error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// --- GET CURRENT USER / PROFILE ---
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error('GET /me error', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

// --- ENROLL IN COURSE ---
router.post('/enroll/:courseId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if already enrolled
    if (!user.enrolledCourses.includes(req.params.courseId)) {
      user.enrolledCourses.push(req.params.courseId);
      await user.save();
    }

    return res.json({ message: 'Course enrolled successfully', enrolledCourses: user.enrolledCourses });
  } catch (err) {
    console.error('Enroll course error:', err);
    return res.status(500).json({ message: 'Server error during enrollment' });
  }
});

export default router;
