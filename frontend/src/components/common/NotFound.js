import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '6rem', md: '8rem' },
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2,
            }}
          >
            404
          </Typography>
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              color: 'text.primary',
            }}
          >
            Page Not Found
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: 'text.secondary',
            }}
          >
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            Back to Home
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound;