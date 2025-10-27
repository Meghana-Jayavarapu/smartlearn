import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  School as SchoolIcon,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Quick Links': [
      { name: 'Home', path: '/' },
      { name: 'Courses', path: '/courses' },
      { name: 'Login', path: '/login' },
      { name: 'Register', path: '/register' },
    ],
    'Categories': [
      { name: 'Web Development', path: '/courses?category=web-development' },
      { name: 'Mobile Development', path: '/courses?category=mobile-development' },
      { name: 'Data Science', path: '/courses?category=data-science' },
      { name: 'Business', path: '/courses?category=business' },
    ],
    'Support': [
      { name: 'Help Center', path: '/help' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Contact Us', path: '/contact' },
    ],
  };

  const socialLinks = [
    { Icon: Facebook, url: 'https://facebook.com' },
    { Icon: Twitter, url: 'https://twitter.com' },
    { Icon: LinkedIn, url: 'https://linkedin.com' },
    { Icon: Instagram, url: 'https://instagram.com' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" color="text.primary" gutterBottom>
                LMS Platform
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Empowering learners worldwide with quality education. Join our community
              and start your learning journey today.
            </Typography>
            <Box sx={{ mt: 2 }}>
              {socialLinks.map(({ Icon, url }, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    mr: 1,
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {title}
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {links.map((link, linkIndex) => (
                  <Box component="li" key={linkIndex} sx={{ mb: 1 }}>
                    <Link
                      component={RouterLink}
                      to={link.path}
                      color="text.secondary"
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} LMS Platform. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;