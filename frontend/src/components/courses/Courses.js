// src/components/courses/Courses.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  Avatar,
  Pagination,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import SchoolIcon from '@mui/icons-material/School';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL;

// prettier-friendly fallback courses with logos (logo: small square icon)
const fallbackCourses = [
  {
    _id: 'c101',
    title: 'Full Stack Web Development with React & Node.js',
    category: 'Web Development',
    level: 'Beginner',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png',
    description: 'Build modern web apps with React frontend and Node/Express backend. Projects + deployment.',
    syllabus: ['HTML & CSS', 'JS', 'React', 'Node.js', 'Express', 'MongoDB'],
    createdAt: '2024-08-01',
  },
  {
    _id: 'c102',
    title: 'Python for Data Science & ML',
    category: 'Data Science',
    level: 'Intermediate',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/python/python.png',
    description: 'Hands-on Python, pandas, visualization and introductory machine learning workflows.',
    syllabus: ['Python', 'pandas', 'Visualization', 'scikit-learn', 'Model Eval'],
    createdAt: '2024-09-10',
  },
  {
    _id: 'c103',
    title: 'Java Programming Masterclass',
    category: 'Programming',
    level: 'Beginner',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/java/java.png',
    description: 'Java fundamentals, OOP, collections, concurrency and practical projects.',
    syllabus: ['Java Basics', 'OOP', 'Collections', 'Concurrency'],
    createdAt: '2024-05-21',
  },
  {
    _id: 'c104',
    title: 'Mobile App Development with Flutter',
    category: 'Mobile Development',
    level: 'Intermediate',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/flutter/flutter-original.svg',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/flutter/flutter.png',
    description: 'Build cross-platform mobile apps with Flutter and Dart — state management & deployment.',
    syllabus: ['Dart', 'Widgets', 'State Management', 'Networking'],
    createdAt: '2024-07-12',
  },
  {
    _id: 'c105',
    title: 'DevOps Fundamentals with Docker & Kubernetes',
    category: 'DevOps',
    level: 'Advanced',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg',
    thumbnail: 'https://raw.githubusercontent.com/github/explore/main/topics/docker/docker.png',
    description: 'Containerization, orchestration, CI/CD, monitoring and scaling for production systems.',
    syllabus: ['Docker', 'Kubernetes', 'CI/CD', 'Monitoring'],
    createdAt: '2024-06-02',
  },
  {
    _id: 'c106',
    title: 'Deep Learning & Neural Networks (AI)',
    category: 'AI & Deep Learning',
    level: 'Advanced',
    logo: 'https://raw.githubusercontent.com/konstantinmuenster/logo-icons/master/images/tensorflow.png',
    thumbnail: 'https://miro.medium.com/v2/resize:fit:1200/1*ZQFZKZ7iM6r-mtMV3J0Rlg.png',
    description: 'Neural networks, CNNs, RNNs and transformers with TensorFlow/PyTorch — practical projects.',
    syllabus: ['Neural Nets', 'CNN', 'RNN', 'Transformers', 'Deployment'],
    createdAt: '2024-10-01',
  },
  {
    _id: 'c107',
    title: 'UI/UX Design Principles',
    category: 'Design',
    level: 'Beginner',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
    thumbnail: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=80&auto=format&fit=crop',
    description: 'Design fundamentals, wireframing, prototyping and user testing using Figma and best practices.',
    syllabus: ['Design Thinking', 'Wireframes', 'Prototyping', 'User Research'],
    createdAt: '2024-04-18',
  },
  {
    _id: 'c108',
    title: 'Cloud Engineering with AWS',
    category: 'Cloud',
    level: 'Intermediate',
    logo: 'https://a0.awsstatic.com/libra-css/images/logos/aws_smile_1200x630.png',
    thumbnail: 'https://images.unsplash.com/photo-1526378723414-7a88a1b7f3b9?w=1200&q=80&auto=format&fit=crop',
    description: 'Core AWS services, IaC, security, and deploying production workloads at scale.',
    syllabus: ['EC2 & S3', 'IAM', 'VPC', 'CloudFormation', 'CI/CD'],
    createdAt: '2024-03-30',
  },
];

const ITEMS_PER_PAGE = 6;

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  // fetch courses (backend) with fallback
  useEffect(() => {
    let mounted = true;
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/courses`);
        if (mounted && Array.isArray(res.data) && res.data.length > 0) {
          // ensure logo field exists for backend entries (optional)
          const normalized = res.data.map(c => ({ ...c, logo: c.logo || c.thumbnail }));
          setCourses(normalized);
        } else if (mounted) {
          setCourses(fallbackCourses);
        }
      } catch (err) {
        console.error('Courses fetch failed — using fallback', err);
        if (mounted) setCourses(fallbackCourses);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCourses();
    return () => { mounted = false; };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(courses.map(c => c.category));
    return ['All', ...Array.from(set)];
  }, [courses]);

  const levels = useMemo(() => {
    const set = new Set(courses.map(c => c.level));
    return ['All', ...Array.from(set)];
  }, [courses]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...courses];

    if (q) {
      list = list.filter(c =>
        (c.title || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q)
      );
    }

    if (category !== 'All') list = list.filter(c => c.category === category);
    if (level !== 'All') list = list.filter(c => c.level === level);

    if (sortBy === 'a-z') list.sort((a, b) => a.title.localeCompare(b.title));
    else list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return list;
  }, [courses, query, category, level, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [pageCount, page]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Courses</Typography>

      {/* Controls */}
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search courses by title, category or description..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            >
              {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <FormControl fullWidth>
            <InputLabel>Level</InputLabel>
            <Select value={level} label="Level" onChange={(e) => { setLevel(e.target.value); setPage(1); }}>
              {levels.map(lv => <MenuItem key={lv} value={lv}>{lv}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth>
            <InputLabel>Sort</InputLabel>
            <Select value={sortBy} label="Sort" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="newest"><SortIcon sx={{ mr: 1 }} />Newest</MenuItem>
              <MenuItem value="a-z"><SortIcon sx={{ mr: 1 }} />Title A→Z</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Course grid */}
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}><Typography>Loading courses...</Typography></Grid>
        ) : paginated.length === 0 ? (
          <Grid item xs={12}><Typography>No courses found.</Typography></Grid>
        ) : paginated.map(course => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={course.thumbnail}
                  alt={course.title}
                  sx={{ objectFit: 'cover' }}
                />
                {/* logo avatar */}
                <Avatar
                  src={course.logo}
                  alt={course.title}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    width: 48,
                    height: 48,
                    border: '2px solid rgba(255,255,255,0.9)',
                    bgcolor: 'rgba(255,255,255,0.8)'
                  }}
                />
                {/* category chip */}
                <Chip
                  label={course.category}
                  size="small"
                  sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff' }}
                />
              </Box>

              <CardContent sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>{course.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {course.description?.slice(0, 110)}{course.description && course.description.length > 110 ? '...' : ''}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Chip label={course.level} color="primary" size="small" />
                  <Typography variant="caption" color="text.secondary">•</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : ''}
                  </Typography>
                </Stack>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Syllabus</Typography>
                  <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                    {(course.syllabus || []).slice(0, 4).map((s, i) => (
                      <li key={i}><Typography variant="body2">{s}</Typography></li>
                    ))}
                    {course.syllabus && course.syllabus.length > 4 && <li><Typography variant="body2">...and more</Typography></li>}
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button size="small" variant="contained" onClick={() => navigate(`/courses/${course._id}`)}>Open</Button>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Preview">
                    <IconButton onClick={() => navigate(`/courses/${course._id}`)} size="small" color="inherit">
                      <SchoolIcon />
                    </IconButton>
                  </Tooltip>
                  <Button size="small" variant="outlined" onClick={() => navigate(`/courses/${course._id}`)}>Details</Button>
                </Stack>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(e, val) => setPage(val)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default Courses;
