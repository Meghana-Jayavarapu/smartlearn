import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import { Lock as LockIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const Unauthorized = () => {
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
          <LockIcon
            sx={{
              fontSize: 64,
              color: 'warning.main',
              mb: 2,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              color: 'text.primary',
            }}
          >
            Access Denied
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: 'text.secondary',
            }}
          >
            You don't have permission to access this page.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Go Back
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Home Page
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Unauthorized;