import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Paper,
  Divider,
  Avatar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import DevicesIcon from '@mui/icons-material/Devices';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Home = () => {
  const featuredCourses = [
    {
      id: '1',
      title: 'Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and more to become a full-stack developer.',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      category: 'Programming',
      instructor: 'John Smith',
      rating: 4.8
    },
    {
      id: '2',
      title: 'Data Science Fundamentals',
      description: 'Master the basics of data analysis, visualization, and machine learning.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      category: 'Data Science',
      instructor: 'Sarah Johnson',
      rating: 4.7
    },
    {
      id: '3',
      title: 'Digital Marketing Masterclass',
      description: 'Learn SEO, social media marketing, email campaigns, and content strategy.',
      image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312',
      category: 'Marketing',
      instructor: 'Michael Brown',
      rating: 4.9
    }
  ];

  const features = [
    {
      icon: <SchoolIcon fontSize="large" />,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of experience.'
    },
    {
      icon: <DevicesIcon fontSize="large" />,
      title: 'Learn Anywhere',
      description: 'Access courses on any device, anytime, anywhere.'
    },
    {
      icon: <EmojiEventsIcon fontSize="large" />,
      title: 'Earn Certificates',
      description: 'Get recognized for your achievements with shareable certificates.'
    }
  ];

  return (
    <Box className="fade-in">
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2
                }}
              >
                Expand Your Knowledge with Online Courses
              </Typography>
              <Typography 
                variant="h5" 
                paragraph
                sx={{ mb: 4, opacity: 0.9 }}
              >
                Learn new skills, advance your career, and explore your passions with our expert-led courses.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <Button 
                  component={RouterLink} 
                  to="/courses" 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100'
                    },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Explore Courses
                </Button>
                <Button 
                  component={RouterLink} 
                  to="/register" 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Sign Up Free
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                component="img"
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Students learning"
                sx={{ 
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  transform: 'perspective(1000px) rotateY(-10deg)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 4,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.light', 
                    width: 80, 
                    height: 80,
                    mb: 2
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Courses Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h3" component="h2" gutterBottom>
              Featured Courses
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Discover our most popular courses and start learning today
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {featuredCourses.map((course) => (
              <Grid item key={course.id} xs={12} sm={6} md={4}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    },
                    borderRadius: 4,
                    overflow: 'hidden',
                    textDecoration: 'none'
                  }}
                  component={RouterLink}
                  to={`/courses/${course.id}`}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.image}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ mb: 1 }}>
                      <Typography 
                        variant="caption" 
                        component="span"
                        sx={{ 
                          bgcolor: 'primary.light',
                          color: 'white',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 10,
                          fontWeight: 500
                        }}
                      >
                        {course.category}
                      </Typography>
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {course.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        By {course.instructor}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                          {course.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                          /5
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              component={RouterLink}
              to="/courses"
              variant="contained" 
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              View All Courses
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'secondary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Start Learning?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 'normal' }}>
            Join thousands of students already learning on our platform
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <Button 
              component={RouterLink}
              to="/register"
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: 'secondary.main',
                '&:hover': {
                  bgcolor: 'grey.100'
                },
                px: 4,
                py: 1.5
              }}
            >
              Sign Up Free
            </Button>
            <Button 
              component={RouterLink}
              to="/about"
              variant="outlined" 
              size="large"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                },
                px: 4,
                py: 1.5
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;