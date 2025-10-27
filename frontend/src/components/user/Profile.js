import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Avatar,
  Stack,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  School as SchoolIcon,
  Create as CreateIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    bio: '',
    profilePicture: '',
  });

  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await axios.get(`${API_URL}/api/auth/profile`, {
        headers: { 'x-auth-token': token },
        timeout: 10000, // 10s timeout
      });

      setProfile(res.data);
      setEditedProfile({
        name: res.data.name,
        bio: res.data.bio || '',
        profilePicture: res.data.profilePicture || '',
      });
      setError('');
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    if (profile) {
      setEditedProfile({
        name: profile.name,
        bio: profile.bio || '',
        profilePicture: profile.profilePicture || '',
      });
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/api/auth/profile`, editedProfile, {
        headers: { 'x-auth-token': token },
        timeout: 10000,
      });
      await fetchProfile();
      setEditing(false);
      setError('');
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseClick = (courseId) => navigate(`/courses/${courseId}`);

  if (loading) return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Container>;

  if (error) return <Container maxWidth="md" sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!profile) return <Container maxWidth="md" sx={{ mt: 4 }}><Alert severity="info">Profile not found</Alert></Container>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ mb: 4 }}>
        <Box sx={{ p: 3, backgroundColor: 'primary.main', color: 'white' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={profile.profilePicture}
              alt={profile.name}
              sx={{ width: 100, height: 100, border: '4px solid white' }}
            />
            <Box sx={{ flexGrow: 1 }}>
              {editing ? (
                <Box>
                  <TextField fullWidth name="name" value={editedProfile.name} onChange={handleInputChange} sx={{ mb: 1, input: { color: 'white' } }} />
                  <TextField fullWidth name="profilePicture" value={editedProfile.profilePicture} onChange={handleInputChange} placeholder="Profile Picture URL" sx={{ input: { color: 'white' } }} />
                </Box>
              ) : (
                <>
                  <Typography variant="h4">{profile.name}</Typography>
                  <Typography variant="body1">{profile.email}</Typography>
                  <Chip label={profile.role} sx={{ mt: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                </>
              )}
            </Box>
            <Box>
              {editing ? (
                <>
                  <IconButton color="inherit" onClick={handleSave}><SaveIcon /></IconButton>
                  <IconButton color="inherit" onClick={handleCancel}><CancelIcon /></IconButton>
                </>
              ) : (
                <IconButton color="inherit" onClick={handleEdit}><EditIcon /></IconButton>
              )}
            </Box>
          </Stack>
        </Box>
        <CardContent>
          {editing ? (
            <TextField fullWidth multiline rows={4} name="bio" value={editedProfile.bio} onChange={handleInputChange} label="Bio" variant="outlined" sx={{ mb: 2 }} />
          ) : (
            profile.bio && <Typography variant="body1" sx={{ mb: 2 }}>{profile.bio}</Typography>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        {/* Enrolled Courses */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}><SchoolIcon sx={{ mr: 1 }} />Enrolled Courses</Typography>
            <Grid container spacing={2}>
              {(profile.enrolledCourses || []).map((course) => (
                <Grid item xs={12} key={course._id}>
                  <Card
                    sx={{ display: 'flex', cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }, transition: 'all 0.2s' }}
                    onClick={() => handleCourseClick(course._id)}
                  >
                    <CardMedia component="img" sx={{ width: 120 }} image={course.thumbnail || 'https://via.placeholder.com/120x80?text=Course'} alt={course.title} />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="h6">{course.title}</Typography>
                      <Typography variant="body2" color="text.secondary">Progress: {course.progress || 0}%</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {(!profile.enrolledCourses || profile.enrolledCourses.length === 0) && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    You haven't enrolled in any courses yet.
                    <Button color="primary" onClick={() => navigate('/courses')} sx={{ ml: 2 }}>Browse Courses</Button>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>

        {/* Created Courses */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}><CreateIcon sx={{ mr: 1 }} />Created Courses</Typography>
            <Grid container spacing={2}>
              {(profile.createdCourses || []).map((course) => (
                <Grid item xs={12} key={course._id}>
                  <Card
                    sx={{ display: 'flex', cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }, transition: 'all 0.2s' }}
                    onClick={() => handleCourseClick(course._id)}
                  >
                    <CardMedia component="img" sx={{ width: 120 }} image={course.thumbnail || 'https://via.placeholder.com/120x80?text=Course'} alt={course.title} />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="h6">{course.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{course.enrolledStudents?.length || 0} students enrolled</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {profile.role === 'instructor' && (!profile.createdCourses || profile.createdCourses.length === 0) && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    You haven't created any courses yet.
                    <Button color="primary" onClick={() => navigate('/courses/create')} sx={{ ml: 2 }}>Create Course</Button>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
