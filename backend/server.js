// D:\MERN\lms\lms\backend\server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

// Import your routes (ensure this path is correct)
import authRoutes from './routes/auth.js';

const app = express();

// --- Security & Middleware ---
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// CORS config
const allowedOrigins = [
  process.env.FRONTEND_URL, // set this in production (Netlify/Render)
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (curl/postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Accept', 'Origin'],
  credentials: true,
  maxAge: 86400
};

// Apply CORS middleware correctly
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight

// --- Request Logger (logs origin) ---
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - origin: ${req.headers.origin}`);
  next();
});

// --- MongoDB Connection ---
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/lms';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection failed:', err);
  process.exit(1);
});

// --- Routes ---
app.use('/api/auth', authRoutes); // Authentication routes (ensure authRoutes exports a router)

// --- Demo Courses Data (mock) ---
const courses = [
  /* same courses array as before — omitted here for brevity in the snippet,
     use your existing courses array with same objects you posted earlier */
];

// Store enrolled courses per server instance (mock)
let enrolledCourses = [];

// --- Courses Routes ---
app.get('/api/courses', (req, res) => res.json(courses));
app.get('/api/courses/enrolled', (req, res) => res.json(enrolledCourses));

app.post('/api/courses/enroll/:id', (req, res) => {
  // Mock auth check
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

// --- Global error handler for CORS rejection and others ---
app.use((err, req, res, next) => {
  if (err && err.message && err.message.includes('CORS')) {
    return res.status(403).json({ ok: false, message: 'CORS error: ' + err.message });
  }
  console.error('Server error:', err);
  return res.status(500).json({ ok: false, message: 'Internal server error' });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send({ activeStatus: true, error: false });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
