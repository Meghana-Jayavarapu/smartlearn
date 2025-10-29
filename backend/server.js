// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';

// Import your routes (if file exists)
import authRoutes from './routes/auth.js';
import coursesRouter from './routes/courses.js'; // <-- mounted below

const app = express();

// --- Middleware ---
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// --- CORS configuration ---
// allow localhost (dev) and your Netlify frontend (production) and any FRONTEND_URL from env
const allowedOrigins = [
  process.env.FRONTEND_URL,               // set this in Vercel/Netlify settings (e.g. https://smartlearn28.netlify.app)
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://smartlearn28.netlify.app'
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // allow requests with no origin (curl/postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','x-auth-token','Accept','Origin'],
  exposedHeaders: ['x-auth-token','Authorization'],
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight

// --- Request logger (early) ---
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - origin: ${req.headers.origin}`);
  next();
});

// --- MongoDB Connection (safe default) ---
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.warn('MongoDB connection failed (continuing with mock data):', err.message || err);
    // don't exit; allow server to run with mock/demo data
  });

// --- Routes (auth) ---
if (authRoutes) {
  app.use('/api/auth', authRoutes);
}

// --- Mount courses router ---
// This makes your backend API available at /api/courses/*
if (coursesRouter) {
  app.use('/api/courses', coursesRouter);
  console.log('Mounted courses routes at /api/courses');
} else {
  console.warn('coursesRouter not found - ensure backend/routes/courses.js exists');
}

// --- Health ---
app.get('/api/health', (req, res) => res.json({ ok: true }));

// --- Error handler ---
app.use((err, req, res, next) => {
  if (err && err.message && err.message.includes('CORS')) {
    return res.status(403).json({ ok: false, message: 'CORS error: ' + err.message });
  }
  console.error('Server error:', err);
  return res.status(500).json({ ok: false, message: 'Internal server error' });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
