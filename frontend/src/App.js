// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

// Global Styles
import './styles/global.css';

// Components
import Navigation from './components/layout/Navigation';
import Home from './components/Home';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/dashboard/Dashboard';
import Courses from './components/courses/Courses';
import CourseDetails from './components/courses/CourseDetails';
import CreateCourse from './components/courses/CreateCourse';
import Profile from './components/profile/Profile';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';
import NotFound from './components/common/NotFound';
import PrivateRoute from './components/common/PrivateRoute';
import Unauthorized from './components/common/Unauthorized';

// New Pages
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import FAQ from './components/pages/FAQ';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
    secondary: { main: '#dc004e', light: '#ff4081', dark: '#c51162' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
    text: { primary: '#2c3e50', secondary: '#546e7a' },
  },
  typography: {
    fontFamily: [
      '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif',
    ].join(','),
    button: { textTransform: 'none', fontWeight: 500 },
  },
});

const App = () => {
  // Auth state managed here (no separate file)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    // keep localStorage in sync
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    // legacy keys some components might read
    if (token) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user?.role || 'student');
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
    }
  }, [token, user]);

  // login action called by LoginForm/RegisterForm
  const handleLogin = (tokenValue, userObj) => {
    setToken(tokenValue || null);
    setUser(userObj || null);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    // cleanup extras
    localStorage.removeItem('lastEnrolledCourse');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  };

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <CssBaseline />
        <ScrollToTop />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
          {/* Navigation expects to be inside a Router provided by index.js */}
          <Navigation user={user} onLogout={handleLogout} />

          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
              <Route path="/register" element={<RegisterForm onLogin={handleLogin} />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Protected routes (PrivateRoute component should check localStorage token or accept props) */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/courses/create" element={<PrivateRoute roles={['instructor']}><CreateCourse /></PrivateRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>

          <Footer />
        </Box>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
