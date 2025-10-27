import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const VideoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '0',
  paddingBottom: '56.25%', // 16:9 aspect ratio
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const VideoPlayer = styled('video')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const LoadingContainer = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
});

const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const CoursePlayer = ({ videoUrl }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
  }, [videoUrl]);

  const handleLoadedData = () => {
    setLoading(false);
  };

  const handleError = (e) => {
    setLoading(false);
    setError('Failed to load video. Please try again later.');
    console.error('Video loading error:', e);
  };

  return (
    <VideoContainer>
      {loading && (
        <LoadingContainer>
          <CircularProgress />
          <Typography variant="body2">Loading video...</Typography>
        </LoadingContainer>
      )}
      {error && <ErrorMessage variant="body1">{error}</ErrorMessage>}
      {videoUrl && (
        <VideoPlayer
          src={videoUrl}
          controls
          onLoadedData={handleLoadedData}
          onError={handleError}
          playsInline
        />
      )}
    </VideoContainer>
  );
};

export default CoursePlayer;