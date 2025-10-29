// src/components/courses/CourseDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, CardMedia, Snackbar, Alert } from '@mui/material';

// normalize API base to ALWAYS include /api at the end
const RAW_API_BASE = process.env.REACT_APP_API_URL || 'https://smartlearn-nu.vercel.app/api';
let API_BASE = String(RAW_API_BASE).replace(/\/+$/, '');
if (!/\/api(\/|$)/i.test(API_BASE)) {
  API_BASE = `${API_BASE.replace(/\/+$/, '')}/api`;
}
function buildUrl(path) {
  const p = String(path).replace(/^\/+/, '');
  return `${API_BASE}/${p}`;
}

const CourseDetails = ({ refreshDashboard }) => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, severity: 'info', msg: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(buildUrl(`/courses/${id}`)); // GET /api/courses/:id
        setCourse(data);
      } catch (err) {
        console.error('Failed to load course:', err);
        setSnack({ open: true, severity: 'error', msg: err?.response?.data?.message || 'Failed to load course' });
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  const handleCloseSnack = () => setSnack(s => ({ ...s, open: false }));

  const handleEnroll = async () => {
    if (!token) {
      setSnack({ open: true, severity: 'warning', msg: 'Please login to enroll' });
      return;
    }
    try {
      // NOTE: backend route is /api/courses/enroll/:id (per your backend file)
      await axios.post(buildUrl(`/courses/enroll/${id}`), {}, { headers: { Authorization: `Bearer ${token}` } });
      setEnrolled(true);
      if (typeof refreshDashboard === 'function') refreshDashboard();
      window.dispatchEvent(new Event('enrolledCoursesUpdated'));
      setSnack({ open: true, severity: 'success', msg: 'Enrolled successfully' });
    } catch (err) {
      console.error('Enroll error:', err);
      setSnack({ open: true, severity: 'error', msg: err?.response?.data?.message || 'Enroll failed' });
    }
  };

  if (loading) return <Typography>Loading course...</Typography>;
  if (!course) return <Typography>Course not found.</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ display: 'flex', mb: 3 }}>
        <CardMedia component="img" sx={{ width: 300 }} image={course.thumbnail} alt={course.title} />
        <CardContent>
          <Typography variant="h4" gutterBottom>{course.title}</Typography>
          <Typography variant="subtitle1" gutterBottom>{course.category} - {course.level}</Typography>
          <Typography variant="body1" paragraph>{course.description}</Typography>
          <Typography variant="h6">Syllabus:</Typography>
          <ul>{(course.syllabus || []).map((item, idx) => <li key={idx}>{item}</li>)}</ul>

          {!enrolled ? (
            <Button variant="contained" color="primary" onClick={handleEnroll}>Enroll Now</Button>
          ) : (
            <Button variant="outlined" color="success" disabled>Enrolled</Button>
          )}
        </CardContent>
      </Card>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={handleCloseSnack} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnack} severity={snack.severity} sx={{ width: '100%' }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseDetails;
