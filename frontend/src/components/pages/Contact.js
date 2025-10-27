import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  TextField, 
  Button, 
  Paper,
  Snackbar,
  Alert,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import PageHeader from '../common/PageHeader';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // In a real app, you would send this data to your backend
      console.log('Form submitted:', formData);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Your message has been sent! We will get back to you soon.',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const contactInfo = [
    {
      icon: <EmailIcon fontSize="large" />,
      title: 'Email Us',
      details: 'support@lms-example.com',
      action: 'mailto:support@lms-example.com'
    },
    {
      icon: <PhoneIcon fontSize="large" />,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    },
    {
      icon: <LocationOnIcon fontSize="large" />,
      title: 'Visit Us',
      details: '123 Learning Street, Education City, EC 12345',
      action: 'https://maps.google.com'
    }
  ];

  return (
    <Container maxWidth="lg" className="fade-in">
      <PageHeader 
        title="Contact Us" 
        subtitle="We'd love to hear from you"
        breadcrumbs={[
          { label: 'Home', link: '/' },
          { label: 'Contact', link: '/contact' }
        ]}
      />
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
              Get In Touch
            </Typography>
            
            <Typography variant="body1" paragraph>
              Have questions about our courses or need help with your account? We're here to help! Fill out the form and our team will get back to you as soon as possible.
            </Typography>
            
            <Box sx={{ my: 4 }}>
              <Grid container spacing={3}>
                {contactInfo.map((info, index) => (
                  <Grid item xs={12} key={index}>
                    <Card sx={{ 
                      bgcolor: 'background.paper',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateX(8px)'
                      }
                    }}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          mr: 2, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          bgcolor: 'primary.light',
                          color: 'white'
                        }}>
                          {info.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6" component="div">
                            {info.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {info.details}
                          </Typography>
                        </Box>
                        <Box sx={{ ml: 'auto' }}>
                          <IconButton 
                            component="a" 
                            href={info.action} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            color="primary"
                          >
                            <SendIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
              Send Us a Message
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{ mt: 2 }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;