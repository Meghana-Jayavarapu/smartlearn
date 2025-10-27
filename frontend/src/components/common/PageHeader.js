import React from 'react';
import { Typography, Box, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle, breadcrumbs }) => {
  return (
    <Box sx={{ mb: 4, mt: 2 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      
      {subtitle && (
        <Typography variant="h6" color="text.secondary" paragraph>
          {subtitle}
        </Typography>
      )}
      
      {breadcrumbs && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return isLast ? (
              <Typography color="text.primary" key={index}>
                {crumb.label}
              </Typography>
            ) : (
              <MuiLink 
                component={Link} 
                to={crumb.link} 
                underline="hover" 
                color="inherit"
                key={index}
              >
                {crumb.label}
              </MuiLink>
            );
          })}
        </Breadcrumbs>
      )}
    </Box>
  );
};

export default PageHeader;