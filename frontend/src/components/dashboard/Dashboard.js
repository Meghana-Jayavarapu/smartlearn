// src/components/dashboard/Dashboard.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Paper } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ChatIcon from '@mui/icons-material/Chat';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  const fetchEnrolledCourses = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.get(`${API_BASE}/courses/enrolled`, { headers });

      let list = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data.courses)) list = data.courses;
      else if (Array.isArray(data.enrolled)) list = data.enrolled;
      else if (Array.isArray(data.data)) list = data.data;
      else list = Array.isArray(data) ? data : (data ? [data] : []);

      setEnrolledCourses(list);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      setEnrolledCourses([]);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    if (mounted) fetchEnrolledCourses();

    const handler = () => { if (mounted) fetchEnrolledCourses(); };
    window.addEventListener('enrolledCoursesUpdated', handler);

    return () => {
      mounted = false;
      window.removeEventListener('enrolledCoursesUpdated', handler);
    };
  }, [fetchEnrolledCourses]);

  const dashboardOptions = [
    { title: 'Messages', icon: <ChatIcon fontSize="large" />, path: '/messages' },
    { title: 'Certificates', icon: <EmojiEventsIcon fontSize="large" />, path: '/certificates' },
    { title: 'Support', icon: <SupportAgentIcon fontSize="large" />, path: '/support' },
    { title: 'Achievements', icon: <AssignmentTurnedInIcon fontSize="large" />, path: '/achievements' },
    { title: 'Analytics', icon: <BarChartIcon fontSize="large" />, path: '/analytics' },
    { title: 'My Courses', icon: <SchoolIcon fontSize="large" />, path: '/dashboard' },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Dashboard</Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>Enrolled Courses</Typography>
      {enrolledCourses.length === 0 ? (
        <Typography>No courses enrolled yet.</Typography>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {enrolledCourses.map(course => (
            <Grid item xs={12} md={4} key={course._id || course.id}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                }}
                onClick={() => navigate(`/courses/${course._id || course.id}`)}
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8 }}
                />
                <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {course.category} | {course.level}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
      <Grid container spacing={3}>
        {dashboardOptions.map(opt => (
          <Grid item xs={12} sm={6} md={4} key={opt.title}>
            <Paper
              elevation={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                cursor: 'pointer',
                textAlign: 'center',
              }}
              onClick={() => navigate(opt.path)}
            >
              {opt.icon}
              <Typography variant="h6" sx={{ mt: 2 }}>{opt.title}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
