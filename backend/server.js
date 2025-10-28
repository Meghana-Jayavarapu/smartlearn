// D:\MERN\lms\lms\backend\server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';

const app = express();

// --- Middleware & Security ---
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// --- CORS Configuration ---
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://smartlearn28.netlify.app'
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman/local
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Accept', 'Origin'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight

// --- Request Logger (for debugging only) ---
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - from: ${req.headers.origin}`);
  next();
});

// --- MongoDB Connection ---
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection failed:', err);
  process.exit(1);
});

// --- Routes ---
app.use('/api/auth', authRoutes);

// --- Mock Courses Data ---
const courses = [
  {
    _id: 'c101',
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, and JavaScript from scratch.',
    category: 'Web Development',
    level: 'Beginner',
    thumbnail: 'https://via.placeholder.com/300x200?text=Web+Development',
    syllabus: ['HTML', 'CSS', 'JavaScript Basics']
  },
  {
    _id: 'c102',
    title: 'Machine Learning Basics',
    description: 'Understand the core concepts of ML and how models learn.',
    category: 'AI & ML',
    level: 'Intermediate',
    thumbnail: 'https://via.placeholder.com/300x200?text=Machine+Learning',
    syllabus: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks']
  },
  {
    _id: 'c103',
    title: 'React for Beginners',
    description: 'Build dynamic web apps using React.js.',
    category: 'Frontend',
    level: 'Beginner',
    thumbnail: 'https://via.placeholder.com/300x200?text=React+JS',
    syllabus: ['JSX', 'Components', 'Hooks', 'State Management']
  }
];

let enrolledCourses = [];

// --- Course Routes ---
app.get('/api/courses', (req, res) => res.json(courses));

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c._id === req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
});

app.get('/api/courses/enrolled', (req, res) => res.json(enrolledCourses));

app.post('/api/courses/enroll/:id', (req, res) => {
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized. Please login.' });

  const course = courses.find(c => c._id === req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  if (!enrolledCourses.some(c => c._id === course._id)) {
    enrolledCourses.push(course);
  }

  res.json({ message: 'Enrolled successfully', enrolledCourses });
});

// --- Health Route ---
app.get('/api/health', (req, res) => res.json({ ok: true }));

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  if (err && err.message.includes('CORS')) {
    return res.status(403).json({ ok: false, message: 'CORS error: ' + err.message });
  }
  console.error('Server error:', err);
  res.status(500).json({ ok: false, message: 'Internal server error' });
});

// --- Default Route ---
app.get('/', (req, res) => {
  res.send({ activeStatus: true, error: false });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
