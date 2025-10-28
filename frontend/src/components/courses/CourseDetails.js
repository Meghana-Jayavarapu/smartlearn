// src/components/courses/CourseDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Button, Card, CardContent, CardMedia, Snackbar, Alert,
} from '@mui/material';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
        try {
          const { data } = await axios.get(`${API_BASE}/courses/${id}`);
          const foundCourse = data.course || data;
          setCourse(foundCourse || null);
        } catch (singleErr) {
          const { data } = await axios.get(`${API_BASE}/courses`);
          const list = Array.isArray(data) ? data : (data.courses || []);
          const found = list.find(c => String(c._id) === String(id));
          setCourse(found || null);
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleCloseSnack = () => setSnack(s => ({ ...s, open: false }));

  const handleEnroll = async () => {
    if (!token) {
      setSnack({ open: true, severity: 'warning', msg: 'Please login to enroll' });
      return;
    }
    try {
      await axios.post(
        `${API_BASE}/courses/enroll/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEnrolled(true);
      if (typeof refreshDashboard === 'function') refreshDashboard();
      window.dispatchEvent(new Event('enrolledCoursesUpdated'));

      setSnack({ open: true, severity: 'success', msg: 'Enrolled successfully' });
    } catch (err) {
      console.error('Enroll error:', err);
      setSnack({ open: true, severity: 'error', msg: err.response?.data?.message || 'Enroll failed' });
    }
  };

  if (loading) return <Typography>Loading course...</Typography>;
  if (!course) return <Typography>Course not found.</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ display: 'flex', mb: 3 }}>
        <CardMedia
          component="img"
          sx={{ width: 300 }}
          image={course.thumbnail}
          alt={course.title}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>{course.title}</Typography>
          <Typography variant="subtitle1" gutterBottom>{course.category} - {course.level}</Typography>
          <Typography variant="body1" paragraph>{course.description}</Typography>
          <Typography variant="h6">Syllabus:</Typography>
          <ul>
            {(course.syllabus || []).map((item, index) => <li key={index}>{item}</li>)}
          </ul>

          {!enrolled && (
            <Button variant="contained" color="primary" onClick={handleEnroll}>
              Enroll Now
            </Button>
          )}
          {enrolled && (
            <Button variant="outlined" color="success" disabled>
              Enrolled
            </Button>
          )}
        </CardContent>
      </Card>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={handleCloseSnack} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnack} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseDetails;
