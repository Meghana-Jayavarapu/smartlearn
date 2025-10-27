import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
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
                variant="h4"
                sx={{
                  mb: 2,
                  color: 'error.main',
                }}
              >
                Oops! Something went wrong
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: 'text.secondary',
                }}
              >
                We apologize for the inconvenience. Please try refreshing the page.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={this.handleRefresh}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                }}
              >
                Refresh Page
              </Button>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box
                  sx={{
                    mt: 4,
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    textAlign: 'left',
                  }}
                >
                  <Typography variant="subtitle2" color="error" gutterBottom>
                    Error Details (Development Only):
                  </Typography>
                  <Typography variant="body2" component="pre" sx={{ overflow: 'auto' }}>
                    {this.state.error.toString()}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;