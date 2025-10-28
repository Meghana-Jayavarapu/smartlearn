import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Avatar, Grid, Card, CardContent } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ForumIcon from '@mui/icons-material/Forum';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>No profile found or not logged in</div>;

  // Define unique profile options
  const options = [
    { title: 'My Courses', icon: <SchoolIcon fontSize="large" />, color: '#4caf50' },
    { title: 'Achievements', icon: <EmojiEventsIcon fontSize="large" />, color: '#ff9800' },
    { title: 'Assignments', icon: <AssignmentIcon fontSize="large" />, color: '#2196f3' },
    { title: 'Discussion Forum', icon: <ForumIcon fontSize="large" />, color: '#9c27b0' },
    { title: 'Library', icon: <LocalLibraryIcon fontSize="large" />, color: '#f44336' },
    { title: 'History', icon: <HistoryEduIcon fontSize="large" />, color: '#3f51b5' },
  ];

  return (
    <Box sx={{ maxWidth: '900px', mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ width: 80, height: 80, mr: 3 }}>{profile.name[0]}</Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold">{profile.name}</Typography>
          <Typography variant="subtitle1">Email: {profile.email}</Typography>
          <Typography variant="subtitle2">Role: {profile.role}</Typography>
        </Box>
      </Box>

      <Typography variant="h5" fontWeight="bold" gutterBottom>Profile Options</Typography>
      <Grid container spacing={3}>
        {options.map((opt, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                backgroundColor: opt.color,
                color: '#fff',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              {opt.icon}
              <CardContent>
                <Typography variant="h6" fontWeight="bold" align="center">
                  {opt.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Profile;
