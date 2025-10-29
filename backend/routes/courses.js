// backend/routes/courses.js
import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js'; // ensure path matches your project

const router = express.Router();

/**
 * POST /api/courses/enroll/:id
 * - Auth required (auth middleware should set req.user.userId or req.user.id)
 * - Uses $addToSet via updateOne to avoid duplicates and race conditions
 * - Returns clear messages and avoids throwing uncaught exceptions
 */
router.post('/enroll/:id', auth, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user?.userId ?? req.user?.id;

    if (!userId) {
      console.warn('Enroll attempt without userId in req.user');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // make sure course exists
    const course = await Course.findOne({ $or: [{ _id: courseId }, { id: courseId }] }).select('_id title').lean();
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Try to add to user's enrolledCourses only if not present
    const updateResult = await User.updateOne(
      { _id: userId, enrolledCourses: { $ne: course._id } }, // condition: not already in array
      { $addToSet: { enrolledCourses: course._id } }
    );

    // updateResult.modifiedCount === 1 -> was added now
    // updateResult.matchedCount === 0 -> either user not found OR condition failed (already enrolled)
    if (updateResult.matchedCount === 0) {
      // Could be user not found OR already enrolled
      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        return res.status(404).json({ message: 'User not found' });
      }
      // user exists but enrolledCourses already contained the course
      return res.status(200).json({ message: 'Already enrolled', course: { _id: course._id, title: course.title } });
    }

    // successfully added
    return res.status(200).json({ message: 'Enrolled successfully', course: { _id: course._id, title: course.title } });
  } catch (err) {
    // log full error for debugging (do not leak stack to client in production)
    console.error('Enroll route error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Server error during enrollment' });
  }
});

export default router;
