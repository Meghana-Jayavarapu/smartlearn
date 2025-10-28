// src/components/auth/RegisterForm.js
import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, Box, Typography, Snackbar, Alert, CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';


const RegisterForm = ({ onLogin }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: 'info', msg: '' });

  const handleClose = () => setSnack(s => ({ ...s, open: false }));
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      const { token, user } = data || {};
      if (!token) throw new Error('No token returned from server');

      // update app-level auth (immediate nav update)
      if (typeof onLogin === 'function') onLogin(token, user);

      setSnack({ open: true, severity: 'success', msg: 'Registration successful' });
      navigate('/dashboard');
    } catch (err) {
      console.error('Register error:', err);
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setSnack({ open: true, severity: 'error', msg: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} required />
        <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
        <Box sx={{ position: 'relative' }}>
          <Button type="submit" variant="contained" disabled={loading} fullWidth>Create account</Button>
          {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />}
        </Box>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={snack.severity} sx={{ width: '100%' }}>{snack.msg}</Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterForm;
