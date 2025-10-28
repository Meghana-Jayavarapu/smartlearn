// src/components/courses/CourseDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Button, Card, CardContent, CardMedia, Snackbar, Alert,
} from '@mui/material';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function buildUrl(path) {
  const base = String(API_BASE).replace(/\/+$/, '');
  let p = String(path).replace(/^\/+/, '');
  if (base.toLowerCase().endsWith('/api') && /^api\/?/i.test(p)) {
    p = p.replace(/^api\/?/i, '');
  }
  return `${base}/${p}`;
}

const CourseDetails = ({ refreshDashboard }) => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, severity: 'info', msg: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCourseFromList = async () => {
      setLoading(true);
      try {
        const url = buildUrl('/api/courses');
        const { data } = await axios.get(url);
        const list = Array.isArray(data) ? data : (data.courses || []);

        // Matching strategies (in order)
        const matches = (c) => {
          if (!c) return false;
          const cid = String(c._id ?? c.id ?? '');
          if (cid === String(id)) return true;
          if (String(parseInt(cid || '', 10)) === String(parseInt(id || '', 10))) return true;
          const slug = (c.slug || '').toString().toLowerCase();
          if (slug && slug === String(id).toLowerCase()) return true;
          if (cid.includes(String(id))) return true;
          if ((c.title || '').toLowerCase().includes(String(id).toLowerCase())) return true;
          return false;
        };

        const found = list.find(matches);
        if (found) {
          setCourse(found);
        } else {
          setSnack({
            open: true,
            severity: 'warning',
            msg: 'Course not found — server returned the list but no matching id.',
          });
          setCourse(null);
        }
      } catch (err) {
        setSnack({ open: true, severity: 'error', msg: 'Failed to load course list (network/CORS).' });
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseFromList();
  }, [id]);

  const handleCloseSnack = () => setSnack(s => ({ ...s, open: false }));

  const handleEnroll = async () => {
    if (!token) {
      setSnack({ open: true, severity: 'warning', msg: 'Please login to enroll' });
      return;
    }
    try {
      await axios.post(
        buildUrl(`/api/courses/enroll/${id}`),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolled(true);
      if (typeof refreshDashboard === 'function') refreshDashboard();
      window.dispatchEvent(new Event('enrolledCoursesUpdated'));
      setSnack({ open: true, severity: 'success', msg: 'Enrolled successfully' });
    } catch (err) {
      setSnack({ open: true, severity: 'error', msg: err?.response?.data?.message || 'Enroll failed' });
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

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnack} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseDetails;
