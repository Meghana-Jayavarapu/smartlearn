import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  CircularProgress,
  Skeleton,
  Container,
  Paper,
  Grid,
} from '@mui/material';

const Loading = ({ variant = 'circular', count = 1, height, width }) => {
  const renderSkeleton = () => (
    <Grid container spacing={2}>
      {Array(count).fill(null).map((_, index) => (
        <Grid item xs={12} key={index}>
          <Skeleton
            variant={variant}
            height={height || 60}
            width={width || '100%'}
            animation="wave"
          />
        </Grid>
      ))}
    </Grid>
  );

  const renderCircular = () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={height || '200px'}
    >
      <CircularProgress />
    </Box>
  );

  const renderCard = () => (
    <Grid container spacing={3}>
      {Array(count).fill(null).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper sx={{ p: 2 }}>
            <Skeleton variant="rectangular" height={140} />
            <Box sx={{ pt: 2 }}>
              <Skeleton width="60%" />
              <Skeleton width="80%" />
              <Skeleton width="40%" />
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container>
      {variant === 'circular' && renderCircular()}
      {(variant === 'text' || variant === 'rectangular') && renderSkeleton()}
      {variant === 'card' && renderCard()}
    </Container>
  );
};

Loading.propTypes = {
  variant: PropTypes.oneOf(['circular', 'text', 'rectangular', 'card']),
  count: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Loading;