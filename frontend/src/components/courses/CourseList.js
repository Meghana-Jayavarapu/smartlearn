import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Rating,
  InputAdornment,
  Skeleton,
  Alert,
  Paper,
  Pagination,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

const CourseList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    priceRange: '',
  });
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['Web Development', 'Programming', 'Data Science', 'Mobile Development', 'DevOps', 'Design'];
  const levels = ['beginner', 'intermediate', 'advanced'];
  const priceRanges = [
    { label: 'Free', value: 'free' },
    { label: 'Under $20', value: 'under20' },
    { label: '$20 - $50', value: '20-50' },
    { label: 'Over $50', value: 'over50' },
  ];
  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Rating', value: 'rating' },
    { label: 'Most Enrolled', value: 'enrolled' },
  ];

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, filters, sortBy, page]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.category) params.append('category', filters.category);
      if (filters.level) params.append('level', filters.level);
      if (filters.priceRange) params.append('priceRange', filters.priceRange);
      if (sortBy) params.append('sort', sortBy);
      params.append('page', page);

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/courses?${params}`, { headers });
      
      // Handle both response formats (array or paginated object)
      if (Array.isArray(response.data)) {
        setCourses(response.data);
        setTotalPages(1);
      } else {
        setCourses(response.data.courses || response.data);
        setTotalPages(Math.ceil((response.data.total || response.data.length) / (response.data.perPage || 10)));
      }
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch courses. Please try again later.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      level: '',
      priceRange: '',
    });
    setSortBy('');
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderFilters = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Search Courses"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Category"
              >
                <MenuItem value="">All</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Level</InputLabel>
              <Select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                label="Level"
              >
                <MenuItem value="">All</MenuItem>
                {levels.map(level => (
                  <MenuItem key={level} value={level} sx={{ textTransform: 'capitalize' }}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Price Range</InputLabel>
              <Select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                label="Price Range"
              >
                <MenuItem value="">All</MenuItem>
                {priceRanges.map(range => (
                  <MenuItem key={range.value} value={range.value}>{range.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="">None</MenuItem>
                {sortOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {(searchTerm || filters.category || filters.level || filters.priceRange || sortBy) && (
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                size="small"
              >
                Clear
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderCourseCard = (course) => (
    <Grid item xs={12} sm={6} md={4} key={course._id}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
      >
        <CardMedia
          component="img"
          height="160"
          image={course.thumbnail}
          alt={course.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 1 }}>
            <Chip
              label={course.category}
              size="small"
              color="primary"
              sx={{ mr: 1 }}
            />
            <Chip
              label={course.level}
              size="small"
              color="secondary"
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>
          <Typography variant="h6" component="h2" gutterBottom noWrap>
            {course.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {course.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {course.instructor.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SchoolIcon sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {course.enrolledStudents?.length || 0} students
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating
              value={course.rating || 0}
              readOnly
              size="small"
              precision={0.5}
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              ({course.reviews?.length || 0} reviews)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="primary">
              ${course.price}
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(`/courses/${course._id}`)}
            >
              View Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderSkeletons = () => (
    Array(6).fill(null).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card sx={{ height: '100%' }}>
          <Skeleton variant="rectangular" height={160} />
          <CardContent>
            <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="text" width="30%" height={32} />
              <Skeleton variant="rectangular" width="30%" height={32} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {renderFilters()}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {loading ? renderSkeletons() : courses.map(renderCourseCard)}
      </Grid>

      {!loading && courses.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No courses found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search or filters to find what you're looking for
          </Typography>
        </Box>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
      )}
    </Container>
  );
};

export default CourseList;