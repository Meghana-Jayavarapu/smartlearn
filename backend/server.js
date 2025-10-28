// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

// Import your routes (if file exists)
import authRoutes from './routes/auth.js';

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

// --- Demo courses (unique ids, no syntax errors) ---
// replace your current `const courses = [...]` with this 14-item array
const courses = [
  {
    _id: 'c101',
    title: 'Full Stack Web Development with React & Node.js',
    category: 'Web Development',
    level: 'Beginner',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png',
    description: 'Build modern web applications with React frontend and Node/Express backend.',
    syllabus: ['HTML/CSS','JavaScript','React','Node.js','Express','MongoDB']
  },
  {
    _id: 'c102',
    title: 'Python for Data Science',
    category: 'Data Science',
    level: 'Intermediate',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/python/python.png',
    description: 'Data analysis, visualization, and introductory ML using Python.',
    syllabus: ['Python','pandas','NumPy','Matplotlib','scikit-learn']
  },
  
  {
    _id: 'c103',
    title: 'React: From Zero to Hero',
    category: 'Frontend',
    level: 'Beginner',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png',
    description: 'Hands-on React, hooks, state management and project-based learning.',
    syllabus: ['JSX','Components','Hooks','Routing','State Management']
  },
  {
  _id: 'c115',
  title: 'Augmented Reality (AR) Development',
  category: 'AR/VR',
  level: 'Advanced',
  thumbnail: 'https://cdn-icons-png.flaticon.com/512/2933/2933245.png',
  description: 'Learn to create interactive AR applications using Unity and ARKit/ARCore.',
  syllabus: ['AR Basics', 'Unity 3D', 'ARKit/ARCore', '3D Modeling', 'Projects']
},
{
  _id: 'c116',
  title: 'Ethical Hacking & Penetration Testing',
  category: 'Cybersecurity',
  level: 'Advanced',
  thumbnail: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  description: 'Master penetration testing, vulnerabilities, and network defense strategies.',
  syllabus: ['Reconnaissance', 'Scanning', 'Exploitation', 'Post-Exploitation', 'Reporting']
},
{
  _id: 'c117',
  title: 'Artificial Intelligence in Healthcare',
  category: 'AI & Healthcare',
  level: 'Intermediate',
  thumbnail: 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png',
  description: 'Explore AI applications in diagnostics, medical imaging, and predictive analytics.',
  syllabus: ['Medical Data', 'Image Processing', 'AI Diagnostics', 'Predictive Models', 'Projects']
},
  {
    _id: 'c104',
    title: 'Data Structures & Algorithms',
    category: 'Programming',
    level: 'Intermediate',
    thumbnail: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    description: 'Core DSA concepts and interview-focused problem solving.',
    syllabus: ['Arrays','Linked Lists','Stacks','Queues','Trees','Graphs','DP']
  },
  {
    _id: 'c105',
    title: 'Mobile App Development with Flutter',
    category: 'Mobile Development',
    level: 'Intermediate',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/flutter/flutter.png',
    description: 'Build cross-platform mobile apps with Flutter & Dart.',
    syllabus: ['Dart','Widgets','State Management','Networking','Deployment']
  },
  {
    _id: 'c106',
    title: 'DevOps Fundamentals with Docker & Kubernetes',
    category: 'DevOps',
    level: 'Advanced',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/docker/docker.png',
    description: 'Containerization and orchestration basics for production-ready apps.',
    syllabus: ['Docker','Kubernetes','CI/CD','Monitoring']
  },
  {
    _id: 'c107',
    title: 'Machine Learning with Python',
    category: 'AI & Machine Learning',
    level: 'Intermediate',
    thumbnail: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg',
    description: 'Supervised & unsupervised learning, model evaluation and pipelines.',
    syllabus: ['Data Prep','Supervised Learning','Unsupervised Learning','Model Eval']
  },
  {
    _id: 'c108',
    title: 'Deep Learning & Neural Networks',
    category: 'AI & Deep Learning',
    level: 'Advanced',
    thumbnail: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
    description: 'Neural networks, CNNs, RNNs and practical deep learning projects.',
    syllabus: ['Neural Nets','CNNs','RNNs','Transformers','Optimization']
  },
  {
    _id: 'c109',
    title: 'Cloud Engineering with AWS',
    category: 'Cloud',
    level: 'Advanced',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    description: 'Core AWS services, IaC and deploying production workloads.',
    syllabus: ['EC2','S3','IAM','VPC','CloudFormation']
  },
  {
    _id: 'c110',
    title: 'UI/UX Design Principles',
    category: 'Design',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=60&auto=format&fit=crop',
    description: 'Design fundamentals, prototyping and user research using Figma.',
    syllabus: ['Design Thinking','Wireframing','Prototyping','User Testing']
  },
  {
    _id: 'c111',
    title: 'Cybersecurity Fundamentals',
    category: 'Security',
    level: 'Beginner',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/2306/2306268.png',
    description: 'Basics of network security, encryption and penetration testing.',
    syllabus: ['Network Security','Encryption','Pen Testing','Firewalls']
  },
  {
    _id: 'c112',
    title: 'Database Design & SQL',
    category: 'Databases',
    level: 'Beginner',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/sql/sql.png',
    description: 'Relational design, SQL queries, indexing and transactions.',
    syllabus: ['ER Modeling','SQL','Indexes','Transactions','Normalization']
  },
  {
    _id: 'c113',
    title: 'Computer Networks',
    category: 'Networking',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1581091012184-7d1b3b8c4f5f?w=800&q=60&auto=format&fit=crop',
    description: 'Understanding network layers, protocols and routing fundamentals.',
    syllabus: ['OSI Model','TCP/IP','Routing','Switching','Subnetting']
  },
  {
    _id: 'c114',
    title: 'Project-Based Capstone',
    category: 'Projects',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=60&auto=format&fit=crop',
    description: 'End-to-end project building, deployment and team collaboration.',
    syllabus: ['Requirements','Design','Implementation','Testing','Deployment']
  }
];


// mock per-instance enrolled storage
let enrolledCourses = [];

// --- Courses routes ---
// --- Courses API (fixed) ---
app.get('/api/courses', (req, res) => {
  return res.json(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const cid = String(req.params.id);
  const course = courses.find(c => String(c._id) === cid || String(c.id) === cid);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  return res.json(course);
});

app.post('/api/courses/enroll/:id', (req, res) => {
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized. Please login.' });

  const cid = String(req.params.id);
  const course = courses.find(c => String(c._id) === cid || String(c.id) === courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  if (!enrolledCourses.some(c => String(c._id) === String(course._id))) {
    enrolledCourses.push(course);
  }

  return res.json({ message: 'Enrolled successfully', enrolledCourses });
});

app.get('/api/courses/enrolled', (req, res) => {
  return res.json(enrolledCourses);
});



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
