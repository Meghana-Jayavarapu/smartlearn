// src/components/layout/Navigation.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar, Box, Toolbar, IconButton, Typography, Menu, Container,
  Avatar, Button, Tooltip, MenuItem, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navigation = ({ user, onLogout }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const isAuthenticated = Boolean(user);
  const userRole = user?.role || 'student';

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    if (typeof onLogout === 'function') onLogout();
    navigate('/');
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';

  const renderMobileMenu = (
    <Menu
      anchorEl={anchorElNav}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      open={Boolean(anchorElNav)}
      onClose={handleCloseNavMenu}
    >
      <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/courses'); }}>Courses</MenuItem>
      <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/about'); }}>About</MenuItem>
      <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/contact'); }}>Contact</MenuItem>
      <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/faq'); }}>FAQ</MenuItem>

      {isAuthenticated ? (
        <>
          {userRole === 'instructor' && <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/courses/create'); }}>Create Course</MenuItem>}
          <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/dashboard'); }}>Dashboard</MenuItem>
          <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/profile'); }}>Profile</MenuItem>
          <MenuItem onClick={() => { handleCloseNavMenu(); handleLogout(); }}>Logout</MenuItem>
        </>
      ) : (
        <>
          <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/login'); }}>Login</MenuItem>
          <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/register'); }}>Register</MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: { xs: 1, md: 0 }, mr: { md: 4 }, textDecoration: 'none', color: 'inherit', fontWeight: 700, letterSpacing: '.1rem' }}
          >
            LMS Platform
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                sx={{ ml: 'auto' }}
              >
                <MenuIcon />
              </IconButton>
              {renderMobileMenu}
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                <Button onClick={() => navigate('/courses')} sx={{ my: 2, color: 'text.primary' }}>Courses</Button>
                <Button onClick={() => navigate('/about')} sx={{ my: 2, color: 'text.primary' }}>About</Button>
                <Button onClick={() => navigate('/contact')} sx={{ my: 2, color: 'text.primary' }}>Contact</Button>
                <Button onClick={() => navigate('/faq')} sx={{ my: 2, color: 'text.primary' }}>FAQ</Button>
                {isAuthenticated && userRole === 'instructor' && <Button onClick={() => navigate('/courses/create')} sx={{ my: 2, color: 'text.primary' }}>Create Course</Button>}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                {isAuthenticated ? (
                  <>
                    <Tooltip title="Open settings">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar alt={user?.name || 'User'}>
                          <AccountCircle />
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                      keepMounted
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/dashboard'); }}>Dashboard</MenuItem>
                      <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>Profile</MenuItem>
                      <MenuItem onClick={() => { handleCloseUserMenu(); handleLogout(); }}>Logout</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Box sx={{ display: 'flex' }}>
                    <Button variant="outlined" onClick={() => navigate('/login')} sx={{ mr: 1 }}>Login</Button>
                    <Button variant="contained" onClick={() => navigate('/register')}>Register</Button>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
