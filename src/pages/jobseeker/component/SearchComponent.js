import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Button, Form, Card, Row, Col, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import { config } from '../../../CommonApi/CommonApis';
import { handleError, handleSuccess } from '../../utils';
import Navbar from './Navbar';
import './SearchComponent.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { FiSearch, FiBriefcase, FiMapPin, FiClock, FiArrowLeft, FiDollarSign, FiUser } from 'react-icons/fi';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [index, setIndex] = useState();

  // Form fields
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('email');
  const name = localStorage.getItem('name');
  // const [applicantName, setApplicantName] = useState(name);
  // const [email, setEmail] = useState(userEmail);
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  // const navigate = useNavigate();

  const getJobs = () => {
    if (!query.trim()) {
      handleError("Please enter a search term");
      return;
    }

    setLoading(true);
    axios.get(config.url.test + 'search-jobs?id=2')
      .then((response) => {
        if (response.data.status === true) {
          setJobs(response.data.jobs);
        } else {
          setJobs([]);
          handleError("No jobs found matching your search");
        }
      })
      .catch(error => {
        handleError("An error occurred. Please try again.");
        console.error('Error fetching jobs:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePreviewClick = (jobId) => {
    setIndex(jobId);
    setShowPreviewModal(true);
  };

  const handleSubmitApplication = async () => {
    if (!resumeUrl || !phone || !experience || !education) {
      handleError('Please fill in all required fields');
      return;
    }

    const requestBody = {
      jobSeekerId: userId,
      name: name,
      email: userEmail,
      phone: phone,
      experience: experience,
      education: education,
      resumeUrl: resumeUrl,
      coverLetter: coverLetter,
      jobId: parseInt(jobs.filter(j => j.id === index).map((job) => job.id)[0]), // Fixed this line
      appliedBy: userId
    };

    try {
      const response = await axios.post(config.url.test + 'apply-job', requestBody);
      if (response.data.code === "01") {
        handleSuccess(response.data.message);
        setShowPreviewModal(false);
        // Clear form
        setPhone('');
        setExperience('');
        setEducation('');
        setResumeUrl('');
        setCoverLetter('');

        
      } else {
        handleError(response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      handleError('Failed to submit application.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatSalary = (amount) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <Navbar />
      <div className="search-container">
        {/* Hero Search Section */}
        <div className="search-hero">
          <div className="search-hero-content">
            <h1 className="search-title">Find Your Dream Job</h1>
            <p className="search-subtitle">Search from thousands of job listings</p>

            <div className="search-box-container">
              <Form.Control
                type="text"
                placeholder="Job title, keywords, or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && getJobs()}
                className="search-input"
              />
              <Button
                onClick={getJobs}
                variant="primary"
                disabled={loading}
                className="search-button"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="ms-2">Searching...</span>
                  </>
                ) : (
                  <>
                    <FiSearch className="me-2" />
                    Search Jobs
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="results-section">
          {jobs.length > 0 ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="results-title">
                  <FiBriefcase className="me-2" />
                  {jobs.length} Jobs Found
                </h4>
                <div className="sort-options">
                  <Form.Select size="sm" className="sort-select">
                    <option>Sort by: Relevance</option>
                    <option>Newest</option>
                    <option>Salary (High to Low)</option>
                    <option>Salary (Low to High)</option>
                  </Form.Select>
                </div>
              </div>

              <Row className="g-4">
                {jobs.map((job) => (
                  <Col key={job.id} lg={4} md={6} sm={12}>
                    <Card className="h-100 job-card">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <Card.Title className="job-title">{job.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted company-name">
                              {job.company}
                            </Card.Subtitle>
                            <div className="job-location mb-2">
                              <FiMapPin className="me-1" />
                              {job.location}
                            </div>
                            <div className="job-salary mb-2">
                              <FiDollarSign className="me-1" />
                              {formatSalary(job.min_salary)} - {formatSalary(job.max_salary)}
                            </div>
                            <div className="job-experience mb-2">
                              <FiUser className="me-1" />
                              {job.experience_level}
                            </div>
                          </div>
                          <div className="job-type-badge">
                            <Badge bg={job.job_type === 'Full-time' ? 'success' : 'info'}>
                              {job.job_type}
                            </Badge>
                          </div>
                        </div>

                        <div className="job-description-preview">
                          {job.description.substring(0, 120)}...
                        </div>

                        <div className="job-skills mt-2 mb-3">
                          <strong>Skills: </strong>
                          {job.skills.split(',').map((skill, i) => (
                            <Badge key={i} pill bg="light" text="dark" className="me-1">
                              {skill.trim()}
                            </Badge>
                          ))}
                        </div>

                        <div className="job-footer mt-3">
                          <div className="job-posted-date">
                            <FiClock className="me-1" />
                            Posted {formatDate(job.posted_on)}
                          </div>
                          {!job.job_status ? (
                            <div
                              className="apply-button"
                              onClick={() => handlePreviewClick(job.id)}
                            >
                              Apply Now
                            </div>
                          ) : (
                            <div className="job-status">
                              <Badge bg="danger">Alredy Applied</Badge>
                            </div>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            !loading && query && (
              <div className="no-results text-center py-5">
                <FiSearch className="no-results-icon" style={{ fontSize: '3rem' }} />
                <h4 className="mt-3">No jobs found</h4>
                <p className="text-muted">Try different keywords or remove filters</p>
                <Button variant="outline-primary" onClick={() => setQuery('')}>
                  Clear Search
                </Button>
              </div>
            )
          )}
        </div>

        {/* Application Modal */}
        <Modal
          open={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          aria-labelledby="job-preview-title"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: 800,
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: 24,
              p: 0,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
                color: 'white',
                p: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              }}
            >
              <Button
                startIcon={<FiArrowLeft />}
                onClick={() => setShowPreviewModal(false)}
                sx={{ color: 'white', mb: 2 }}
              >
                Back
              </Button>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
                {jobs.filter(j => j.id === index).map((job) => job.title)}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                {jobs.filter(j => j.id === index).map((job) => job.company)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FiMapPin style={{ marginRight: 6 }} />
                  <Typography variant="body2">
                    {jobs.filter(j => j.id === index).map((job) => job.location)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FiDollarSign style={{ marginRight: 6 }} />
                  <Typography variant="body2">
                    {jobs.filter(j => j.id === index).map((job) => `${formatSalary(job.min_salary)} - ${formatSalary(job.max_salary)}`)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FiClock style={{ marginRight: 6 }} />
                  <Typography variant="body2">
                    Posted {formatDate(jobs.find(j => j.id === index)?.posted_on)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ p: 4 }}>
              {/* Job Description */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                  Job Description
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {jobs.filter(j => j.id === index).map((job) => job.description)}
                </Typography>
              </Box>

              {/* Skills */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                  Required Skills
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {jobs.filter(j => j.id === index).map((job) =>
                    job.skills.split(',').map((skill, i) => (
                      <Badge key={i} pill bg="primary" sx={{ px: 2, py: 1 }}>
                        {skill.trim()}
                      </Badge>
                    ))
                  )}
                </Box>
              </Box>

              {/* Company Info */}
              <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                  About the Company
                </Typography>
                <Typography variant="body1">
                  {jobs.filter(j => j.id === index).map((job) => job.company_description)}
                </Typography>
              </Paper>

              {/* Application Form */}
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 3 }}>
                Application Form
              </Typography>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                value={name}
                disabled
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={userEmail}
                disabled
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Phone Number *"
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (123) 456-7890"
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Years of Experience *"
                variant="outlined"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 5 years"
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Education *"
                variant="outlined"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. Bachelor's in Computer Science"
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Resume URL *"
                variant="outlined"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://example.com/your-resume.pdf"
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Cover Letter (Optional)"
                variant="outlined"
                multiline
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell us why you're a good fit for this position..."
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitApplication}
                  disabled={!resumeUrl || !phone || !experience || !education}
                >
                  Submit Application
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default SearchComponent;