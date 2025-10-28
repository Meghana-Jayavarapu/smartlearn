// src/components/courses/CourseDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, CardMedia,  } from '@mui/material';

const API_BASE = process.env.REACT_APP_API_URL;

const CourseDetails = ({ refreshDashboard }) => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  const token = localStorage.getItem('token'); // store real token after login

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/courses`);
        const found = res.data.find(c => c._id === id);
        setCourse(found || null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!token) {
      alert('Please login to enroll');
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/courses/enroll/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEnrolled(true);
      if (refreshDashboard) refreshDashboard(); // update dashboard
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Enroll failed');
    }
  };

  if (!course) return <Typography>Loading course...</Typography>;

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
            {course.syllabus.map((item, index) => <li key={index}>{item}</li>)}
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
    </Box>
  );
};

export default CourseDetails;
