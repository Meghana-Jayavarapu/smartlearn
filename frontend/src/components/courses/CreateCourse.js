import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardMedia,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    price: '',
    thumbnail: null,
    lessons: [],
  });

  const categories = ['Web Development', 'Programming', 'Data Science', 'Mobile Development', 'DevOps', 'Design'];
  const levels = ['beginner', 'intermediate', 'advanced'];

  const steps = ['Course Details', 'Media Upload', 'Review & Submit'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData(prev => ({
        ...prev,
        thumbnail: file
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveThumbnail = () => {
    setCourseData(prev => ({
      ...prev,
      thumbnail: null
    }));
    setPreviewImage(null);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        return courseData.title && courseData.description && courseData.category && courseData.level && courseData.price;
      case 1:
        return courseData.thumbnail;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      Object.keys(courseData).forEach(key => {
        if (key !== 'lessons') {
          formData.append(key, courseData[key]);
        }
      });

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/courses`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess('Course created successfully!');
      setTimeout(() => {
        navigate(`/courses/${response.data._id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={courseData.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Level</InputLabel>
                <Select
                  name="level"
                  value={courseData.level}
                  onChange={handleInputChange}
                  label="Level"
                >
                  {levels.map(level => (
                    <MenuItem key={level} value={level} sx={{ textTransform: 'capitalize' }}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={courseData.price}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: '$',
                }}
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              style={{ display: 'none' }}
              id="thumbnail-upload"
            />
            <label htmlFor="thumbnail-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                sx={{ mb: 3 }}
              >
                Upload Thumbnail
              </Button>
            </label>

            {previewImage && (
              <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
                <Card>
                  <CardMedia
                    component="img"
                    image={previewImage}
                    alt="Course thumbnail preview"
                    sx={{ width: 300, height: 200, objectFit: 'cover' }}
                  />
                </Card>
                <IconButton
                  onClick={handleRemoveThumbnail}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'error.light', color: 'white' },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Course Details</Typography>
              <Box sx={{ pl: 2 }}>
                <Typography><strong>Title:</strong> {courseData.title}</Typography>
                <Typography><strong>Category:</strong> {courseData.category}</Typography>
                <Typography><strong>Level:</strong> {courseData.level}</Typography>
                <Typography><strong>Price:</strong> ${courseData.price}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Description</Typography>
              <Box sx={{ pl: 2 }}>
                <Typography>{courseData.description}</Typography>
              </Box>
            </Grid>
            {previewImage && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Thumbnail</Typography>
                <Card sx={{ maxWidth: 300 }}>
                  <CardMedia
                    component="img"
                    image={previewImage}
                    alt="Course thumbnail"
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                </Card>
              </Grid>
            )}
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Create New Course
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<BackIcon />}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || !validateStep()}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  Create Course
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  color="primary"
                  disabled={!validateStep()}
                  endIcon={<NextIcon />}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateCourse;