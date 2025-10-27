import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Avatar, 
  Button,
  Paper
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';
import PageHeader from '../common/PageHeader';

const About = () => {
  return (
    <Container maxWidth="lg" className="fade-in">
      <PageHeader 
        title="About Us" 
        subtitle="Learn more about our mission"
        breadcrumbs={[
          { label: 'Home', link: '/' },
          { label: 'About Us', link: '/about' }
        ]}
      />
      
      <Paper elevation={2} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          At LMS, we believe that education should be accessible to everyone. Our mission is to provide high-quality learning experiences that empower individuals to achieve their personal and professional goals.
        </Typography>
        <Typography variant="body1" paragraph>
          Founded in 2025, we've grown from a small startup to a platform serving thousands of students worldwide. Our courses are designed by industry experts and educators who are passionate about sharing their knowledge.
        </Typography>
        
        <Box sx={{ my: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', bgcolor: 'primary.main', mb: 2 }}>
                  <SchoolIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Quality Education
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our courses are designed by experts and regularly updated to ensure relevance.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', bgcolor: 'secondary.main', mb: 2 }}>
                  <GroupIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Community Learning
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Join a community of learners and instructors who support each other.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', bgcolor: 'warning.main', mb: 2 }}>
                  <StarIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Accessible Learning
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Learn at your own pace, anytime, anywhere with our flexible platform.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Ready to start learning?
            </Typography>
            <Typography variant="body1" paragraph>
              Join thousands of students already learning on our platform. Browse our courses and find the perfect match for your learning goals.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Button 
              component={Link} 
              to="/courses" 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Explore Courses
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default About;