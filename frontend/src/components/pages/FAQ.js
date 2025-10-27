import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  TextField,
  InputAdornment,
  Paper,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import PageHeader from '../common/PageHeader';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(false);

  const faqData = [
    {
      category: 'Account & Registration',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'To create an account, click on the "Register" button in the top right corner of the homepage. Fill in your details including name, email, and password, then click "Create Account".'
        },
        {
          question: 'Can I use the same email for multiple accounts?',
          answer: 'No, each account must have a unique email address. If you try to register with an email that is already in use, you will receive an error message.'
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click on the "Login" button, then select "Forgot Password". Enter your email address and follow the instructions sent to your email to reset your password.'
        }
      ]
    },
    {
      category: 'Courses & Learning',
      questions: [
        {
          question: 'How do I enroll in a course?',
          answer: 'Browse our course catalog, select the course you want to take, and click the "Enroll" button on the course page. You will be prompted to log in if you haven\'t already.'
        },
        {
          question: 'Can I access course materials after completion?',
          answer: 'Yes, once you enroll in a course, you will have lifetime access to the course materials, even after you complete the course.'
        },
        {
          question: 'How do I track my progress?',
          answer: 'Your progress is automatically tracked in your dashboard. You can see which lessons you\'ve completed and your overall course progress.'
        },
        {
          question: 'Are there any deadlines for completing courses?',
          answer: 'No, our courses are self-paced. You can take as much time as you need to complete them.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          question: 'What should I do if a video won\'t play?',
          answer: 'First, check your internet connection. If that\'s not the issue, try refreshing the page or using a different browser. If problems persist, contact our support team.'
        },
        {
          question: 'How do I report a bug or technical issue?',
          answer: 'You can report bugs or technical issues through the "Contact Us" page or by emailing support@lms-example.com with details about the problem you\'re experiencing.'
        }
      ]
    },
    {
      category: 'Instructors & Teaching',
      questions: [
        {
          question: 'How do I become an instructor?',
          answer: 'To become an instructor, go to your profile settings and select "Become an Instructor". You\'ll need to provide information about your expertise and the courses you plan to create.'
        },
        {
          question: 'How do I create a course?',
          answer: 'Once approved as an instructor, you can create a course by clicking on "Create Course" in your dashboard. Follow the step-by-step guide to set up your course structure, upload content, and publish.'
        }
      ]
    }
  ];

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Filter FAQs based on search term
  const filteredFAQs = searchTerm 
    ? faqData.map(category => ({
        ...category,
        questions: category.questions.filter(
          q => q.question.toLowerCase().includes(searchTerm) || 
               q.answer.toLowerCase().includes(searchTerm)
        )
      })).filter(category => category.questions.length > 0)
    : faqData;

  return (
    <Container maxWidth="lg" className="fade-in">
      <PageHeader 
        title="Frequently Asked Questions" 
        subtitle="Find answers to common questions about our platform"
        breadcrumbs={[
          { label: 'Home', link: '/' },
          { label: 'FAQ', link: '/faq' }
        ]}
      />
      
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Search FAQs..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 4 }}
        />
        
        {filteredFAQs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No results found for "{searchTerm}"
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Try using different keywords or browse all categories below
            </Typography>
            <Button variant="outlined" onClick={() => setSearchTerm('')}>
              Clear Search
            </Button>
          </Box>
        ) : (
          filteredFAQs.map((category, categoryIndex) => (
            <Box key={categoryIndex} sx={{ mb: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  color: 'primary.main',
                  mb: 2 
                }}
              >
                {category.category}
              </Typography>
              
              {category.questions.map((faq, faqIndex) => {
                const panelId = `${categoryIndex}-${faqIndex}`;
                return (
                  <Accordion 
                    key={faqIndex}
                    expanded={expanded === panelId}
                    onChange={handleChange(panelId)}
                    sx={{ 
                      mb: 1,
                      '&:before': { display: 'none' },
                      boxShadow: 'none',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '8px !important',
                      overflow: 'hidden',
                      '&.Mui-expanded': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${panelId}-content`}
                      id={`panel${panelId}-header`}
                      sx={{ 
                        bgcolor: expanded === panelId ? 'primary.light' : 'background.paper',
                        color: expanded === panelId ? 'white' : 'text.primary',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: expanded === panelId ? 'primary.light' : 'action.hover',
                        }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3 }}>
                      <Typography variant="body1">
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          ))
        )}
      </Paper>
      
      <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Still have questions?
        </Typography>
        <Typography variant="body1" paragraph>
          If you couldn't find the answer to your question, feel free to contact our support team.
        </Typography>
        <Button 
          variant="contained" 
          href="/contact"
          sx={{ 
            bgcolor: 'white', 
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'grey.100'
            }
          }}
        >
          Contact Support
        </Button>
      </Paper>
    </Container>
  );
};

export default FAQ;