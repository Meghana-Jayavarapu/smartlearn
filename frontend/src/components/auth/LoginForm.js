// src/components/auth/LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, TextField, Button, Typography, Box, Snackbar, Alert, CircularProgress,
} from '@mui/material';

const API_BASE = process.env.REACT_APP_API_URL;;

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: 'info', msg: '' });

  const handleClose = () => setSnack(s => ({ ...s, open: false }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
      const { token, user } = res.data || {};
      if (!token) throw new Error('No token returned from server');

      // call onLogin passed from App.js (updates nav immediately)
      if (typeof onLogin === 'function') onLogin(token, user);

      setSnack({ open: true, severity: 'success', msg: 'Login successful' });
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || err.message || 'Login failed';
      setSnack({ open: true, severity: 'error', msg: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <Box sx={{ position: 'relative' }}>
          <Button type="submit" variant="contained" disabled={loading} fullWidth>Login</Button>
          {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />}
        </Box>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={snack.severity} sx={{ width: '100%' }}>{snack.msg}</Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginForm;
