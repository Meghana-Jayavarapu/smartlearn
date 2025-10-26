// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

// Import your routes
import authRoutes from './routes/auth.js'; // Make sure this file exists

const app = express();

// --- Security & Middleware ---
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','x-auth-token','Accept','Origin'],
  exposedHeaders: ['x-auth-token','Authorization'],
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// --- MongoDB Connection ---
const mongoUri = process.env.MONGODB_URI;

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
app.use('/api/auth', authRoutes); // Authentication routes

// --- Demo Courses Data ---
const courses = [
  {
    _id: 'c101',
    title: 'Full Stack Web Development with React and Node.js',
    category: 'Web Development',
    level: 'Beginner',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png',
    description: 'Build modern web applications with React and Node.js...',
    syllabus: ['HTML/CSS', 'JS Basics', 'React Fundamentals', 'Node & Express', 'MongoDB', 'Auth', 'Project']
  },
  {
    _id: 'c102',
    title: 'Python for Data Science',
    category: 'Data Science',
    level: 'Intermediate',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/python/python.png',
    description: 'Learn Python, NumPy, pandas, ML basics...',
    syllabus: ['Python Basics', 'pandas', 'Matplotlib', 'ML Intro', 'Regression', 'Classification', 'Project']
  },
  {
    _id: 'c103',
    title: 'Java Programming Masterclass',
    category: 'Programming',
    level: 'Beginner',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/java/java.png',
    description: 'Java OOP, collections, multithreading, projects...',
    syllabus: ['Java Basics', 'OOP', 'Collections', 'Multithreading', 'Exception Handling', 'Project']
  },
  {
    _id: 'c104',
    title: 'Mobile App Development with Flutter',
    category: 'Mobile Development',
    level: 'Intermediate',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/flutter/flutter.png',
    description: 'Build cross-platform apps with Flutter...',
    syllabus: ['Flutter Basics', 'Widgets & Layouts', 'State Management', 'Networking', 'Navigation', 'Project']
  },
  {
    _id: 'c105',
    title: 'DevOps Fundamentals',
    category: 'DevOps',
    level: 'Advanced',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/docker/docker.png',
    description: 'Learn Docker, Kubernetes, CI/CD pipelines...',
    syllabus: ['Docker', 'Kubernetes', 'CI/CD', 'Monitoring', 'Final Project']
  },
  {
    _id: 'c106',
    title: 'Deep Learning with AI',
    category: 'AI & Deep Learning',
    level: 'Advanced',
    thumbnail: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
    description: 'Learn deep learning, neural networks, and AI models...',
    syllabus: ['Neural Networks', 'CNN', 'RNN', 'TensorFlow', 'PyTorch', 'Projects']
  }
  
];
courses.push(
  {
    _id: 'c107',
    title: 'Machine Learning with Python',
    category: 'AI & Machine Learning',
    level: 'Intermediate',
    thumbnail: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg',
    description: 'Learn ML algorithms, feature engineering, and model evaluation using Python.',
    syllabus: ['Data Preprocessing', 'Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Projects']
  },
  {
    _id: 'c108',
    title: 'Cloud Computing with AWS',
    category: 'Cloud',
    level: 'Advanced',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    description: 'Master AWS cloud services, deployments, and cloud infrastructure management.',
    syllabus: ['EC2', 'S3', 'Lambda', 'VPC', 'CloudFormation', 'Projects']
  },
  {
    _id: 'c109',
    title: 'Cybersecurity Fundamentals',
    category: 'Security',
    level: 'Beginner',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/2306/2306268.png',
    description: 'Understand network security, encryption, and basic cybersecurity practices.',
    syllabus: ['Network Security', 'Encryption', 'Penetration Testing', 'Firewalls', 'Projects']
  });
  courses.push({
    _id: 'c107',
    title: 'Data Structures & Algorithms',
    category: 'Programming',
    level: 'Intermediate',
    thumbnail: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    description: 'Master DSA concepts, problem-solving techniques, and interview preparation.',
    syllabus: ['Arrays & Strings', 'Linked Lists', 'Stacks & Queues', 'Trees', 'Graphs', 'Sorting', 'Searching', 'Dynamic Programming']
  },
);


// Store enrolled courses per user session (mock)
let enrolledCourses = [];

// --- Courses Routes ---
app.get('/api/courses', (req, res) => res.json(courses));
app.get('/api/courses/enrolled', (req, res) => res.json(enrolledCourses));

app.post('/api/courses/enroll/:id', (req, res) => {
  // Mock auth check
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Unauthorized. Please login.' });

  const course = courses.find(c => c._id === req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  if (!enrolledCourses.some(c => c._id === course._id)) {
    enrolledCourses.push(course);
  }

  res.json({ message: 'Enrolled successfully', enrolledCourses });
});

// --- Health Route ---
app.get('/api/health', (req, res) => res.json({ ok: true }));

// --- Request Logger ---
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - origin: ${req.headers.origin}`);
  next();
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
