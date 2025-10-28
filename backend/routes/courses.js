// backend/routes/courses.js
import express from 'express';
import auth from '../middleware/auth.js';
import Course from '../models/Course.js';
const router = express.Router();

// Return all courses (no limit)
router.get('/', async (req, res) => {
  try {
    // If you're using a DB model:
    const courses = await Course.find({});
    return res.json(courses);
  } catch (err) {
    console.error('/api/courses error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findOne({ $or: [{ _id: req.params.id }, { id: req.params.id }] });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    return res.json(course);
  } catch (err) {
    console.error('/api/courses/:id error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Mock enrolled list (per server instance)
let enrolledCourses = [];
router.get('/enrolled/list', (req, res) => res.json(enrolledCourses));

// Enroll (mock)
router.post('/enroll/:id', auth, async (req, res) => {
  try {
    const course = await Course.findOne({ $or: [{ _id: req.params.id }, { id: req.params.id }] });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!enrolledCourses.some(c => String(c._id) === String(course._id))) enrolledCourses.push(course);
    return res.json({ message: 'Enrolled successfully', enrolledCourses });
  } catch (err) {
    console.error('/api/courses/enroll error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Optional: create course (admin)
router.post('/', auth, async (req, res) => {
  try {
    const payload = req.body;
    const course = new Course(payload);
    await course.save();
    return res.status(201).json(course);
  } catch (err) {
    console.error('create course error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
