import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  School as SchoolIcon,
  Laptop as LaptopIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <SchoolIcon fontSize="large" color="primary" />,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of experience',
    },
    {
      icon: <LaptopIcon fontSize="large" color="primary" />,
      title: 'Flexible Learning',
      description: 'Study at your own pace with lifetime access to courses',
    },
    {
      icon: <GroupIcon fontSize="large" color="primary" />,
      title: 'Community Support',
      description: 'Join a community of learners and share knowledge',
    },
    {
      icon: <TrendingUpIcon fontSize="large" color="primary" />,
      title: 'Career Growth',
      description: 'Gain skills that help advance your career',
    },
  ];

  const categories = [
    {
      title: 'Web Development',
      image: 'https://source.unsplash.com/random/800x600/?coding',
      description: 'Master modern web technologies and frameworks',
    },
    {
      title: 'Data Science',
      image: 'https://source.unsplash.com/random/800x600/?data',
      description: 'Learn data analysis, machine learning, and statistics',
    },
    {
      title: 'Mobile Development',
      image: 'https://source.unsplash.com/random/800x600/?mobile',
      description: 'Build iOS and Android applications',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random/1920x1080/?education)',
          minHeight: isMobile ? '60vh' : '80vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Increase the priority of the hero background image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.6)',
          }}
        />
        <Container maxWidth="lg">
          <Grid container>
            <Grid item md={8} xs={12}>
              <Box
                sx={{
                  position: 'relative',
                  p: { xs: 3, md: 6 },
                  pr: { md: 0 },
                }}
              >
                <Typography
                  component="h1"
                  variant="h2"
                  color="inherit"
                  gutterBottom
                  sx={{ fontWeight: 'bold' }}
                >
                  Transform Your Future with Online Learning
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                  Access high-quality courses taught by expert instructors. Learn at your own pace and achieve your goals.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/courses')}
                  sx={{ mt: 4 }}
                >
                  Explore Courses
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Why Choose Us
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {feature.icon}
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            Popular Categories
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => navigate('/courses')}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image}
                    alt={category.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            Ready to Start Learning?
          </Typography>
          <Typography variant="body1" paragraph>
            Join thousands of students who are already learning on our platform.
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;