import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../utils';
import axios from 'axios';
import { config } from '../../CommonApi/CommonApis';
import './Job.css';

import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Chip,
  Divider,
  Box,
  Paper,
  Avatar,
  Tabs,
  Tab,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassIcon,
  RateReview as ReviewIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  Event as EventIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: <HourglassIcon color="warning" /> },
  { value: 'reviewed', label: 'Reviewed', icon: <ReviewIcon color="info" /> },
  { value: 'accepted', label: 'Accepted', icon: <CheckCircleIcon color="success" /> },
  { value: 'rejected', label: 'Rejected', icon: <CancelIcon color="error" /> },
];

const statusColors = {
  pending: 'warning',
  reviewed: 'info',
  accepted: 'success',
  rejected: 'error'
};

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    height: 4,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  minWidth: 0,
  minHeight: 48,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
}));

const JobDetailItem = ({ icon, label, value }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Box display="flex" alignItems="center" mb={2}>
      <Box mr={2} color="text.secondary">
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
        <Typography variant="body1">{value || '-'}</Typography>
      </Box>
    </Box>
  </Grid>
);

const Job = () => {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [statusInputs, setStatusInputs] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const userId = localStorage.getItem('userId');
  const jobId = localStorage.getItem('id');

  const getJob = useCallback(() => {
    axios.get(`${config.url.test}job-applications?id=${jobId}`)
      .then((response) => {
        if (response.data.status === true) {
          const data = response.data.jobs[0];
          const job_applications = JSON.parse(data.job_applications || "[]");

          const enhancedJob = {
            ...data,
            job_applications: job_applications.map(app => ({
              ...app,
              phone: app.phone || 'Not provided',
              linkedin: app.linkedin || '',
              github: app.github || '',
              experience: app.experience || 'Not specified',
              education: app.education || 'Not specified'
            })),
            skills: data.skills || '',
            min_salary: data.min_salary || 0,
            max_salary: data.max_salary || 0,
            experience_level: data.experience_level || 'Not specified',
            company_description: data.company_description || '',
            posted_on: data.posted_on || new Date().toISOString(),
            application_deadline: data.application_deadline || ''
          };

          setJob(enhancedJob);

          if (job_applications.length > 0) {
            const firstStatus = job_applications[0].status;
            const statusIndex = statusOptions.findIndex(opt => opt.value === firstStatus);
            if (statusIndex >= 0) {
              setTabValue(statusIndex);
            }
          }
        } else {
          setJob([]);
        }
      })
      .catch(error => {
        setMessage('Failed to fetch jobs. Please try again later.');
        handleError("An error occurred. Please try again.");
        console.error('Error fetching jobs:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [jobId]); // ✅ only necessary dependencies

  useEffect(() => {
    getJob();
  }, [getJob]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusChange = (app) => {
    const inputs = statusInputs[app.id];
    if (!inputs?.status) {
      handleError('Please select a status');
      return;
    }
    if (!inputs?.reason) {
      handleError('Please enter reason for status');
      return;
    }

    const requestBody = {
      jobId: job.id,
      jobSeekerId: app.job_seeker_id || app.jobSeekerId || app.jobSeeker?.id || app.id,
      status: inputs.status,
      reasonForStatus: inputs.reason,
      statusUpdatedBy: userId,
    };

    axios.post(config.url.test + 'update-status', requestBody)
      .then(response => {
        if (response.data.code === "01") {
          handleSuccess(response.data.message);
          getJob();
        } else {
          handleError(response.data.message);
        }
      })
      .catch(error => {
        handleError('Failed to update status');
      });
  };

  const handleDeleteJob = () => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      handleSuccess('Job deleted successfully');
      navigate('/jobs');
    }
  };

  const filteredApplications = job?.job_applications?.filter(app =>
    app.status === statusOptions[tabValue]?.value
  ) || [];

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );

  if (message) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Typography color="error" variant="h6">{message}</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box mb={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/employe-dashboard')}
          sx={{ borderRadius: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Card className="application-card">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
              {job?.title}
            </Typography>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteJob}
              sx={{ borderRadius: 2 }}
            >
              Delete Job
            </Button>
          </Box>

          {/* Enhanced Job Details Section */}
          <Accordion defaultExpanded sx={{ mb: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Job Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <JobDetailItem
                  icon={<BusinessIcon />}
                  label="Company"
                  value={job?.company}
                />
                <JobDetailItem
                  icon={<LocationIcon />}
                  label="Location"
                  value={job?.location}
                />
                <JobDetailItem
                  icon={<PeopleIcon />}
                  label="Applications"
                  value={job?.job_applications?.length}
                />
                <JobDetailItem
                  icon={<WorkIcon />}
                  label="Experience Level"
                  value={job?.experience_level}
                />
                <JobDetailItem
                  icon={<MoneyIcon />}
                  label="Salary Range"
                  value={`${formatSalary(job?.min_salary)} - ${formatSalary(job?.max_salary)}`}
                />
                <JobDetailItem
                  icon={<EventIcon />}
                  label="Posted On"
                  value={formatDate(job?.posted_on)}
                />
                <JobDetailItem
                  icon={<EventIcon />}
                  label="Application Deadline"
                  value={formatDate(job?.application_deadline)}
                />
              </Grid>

              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  <CodeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Required Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {job?.skills?.split(',').map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill.trim()} 
                      variant="outlined"
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                </Box>
              </Box>

              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  <DescriptionIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Job Description
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {job?.description}
                </Typography>
              </Box>

              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  <BusinessIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  About Company
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {job?.company_description}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Applications Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Applications
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage all job applications in one place
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {statusOptions.map((option, index) => (
              <StyledTab
                key={option.value}
                label={
                  <Box display="flex" alignItems="center">
                    {option.icon}
                    <Box ml={1}>{option.label}</Box>
                    <Box ml={1}>
                      <Chip
                        label={
                          job?.job_applications?.filter(app => app.status === option.value).length || 0
                        }
                        size="small"
                      />
                    </Box>
                  </Box>
                }
              />
            ))}
          </StyledTabs>

          {filteredApplications.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="body1" color="textSecondary">
                No {statusOptions[tabValue]?.label.toLowerCase()} applications found.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredApplications.map(app => (
                <Grid item xs={12} key={app.id}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Box display="flex" alignItems="flex-start" mb={2}>
                        <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                          {app.name.charAt(0)}
                        </Avatar>
                        <Box flexGrow={1}>
                          <Typography variant="h6">{app.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            <EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {app.email}
                          </Typography>
                          <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                            <Button
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ borderRadius: 2 }}
                            >
                              View Resume
                            </Button>
                            <Chip
                              label={app.status}
                              color={statusColors[app.status] || 'default'}
                              variant="outlined"
                              size="small"
                              sx={{ borderRadius: 1 }}
                            />
                            {app.linkedin && (
                              <Button
                                variant="outlined"
                                startIcon={<LinkedInIcon />}
                                href={app.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ borderRadius: 2 }}
                              >
                                LinkedIn
                              </Button>
                            )}
                            {app.github && (
                              <Button
                                variant="outlined"
                                startIcon={<GitHubIcon />}
                                href={app.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ borderRadius: 2 }}
                              >
                                GitHub
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                          <Typography variant="body1">
                            <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            {app.phone}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="subtitle2" color="textSecondary">Experience</Typography>
                          <Typography variant="body1">
                            <WorkIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            {app.experience}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="subtitle2" color="textSecondary">Education</Typography>
                          <Typography variant="body1">
                            <SchoolIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            {app.education}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Accordion sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>Cover Letter</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                            {app.cover_letter || 'No cover letter provided'}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      {tabValue === 0 ? (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>Update Application Status</Typography>
                          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                            {statusOptions.map(option => (
                              <Chip
                                key={option.value}
                                label={option.label}
                                icon={option.icon}
                                onClick={() => setStatusInputs(prev => ({
                                  ...prev,
                                  [app.id]: {
                                    ...prev[app.id],
                                    status: option.value
                                  }
                                }))}
                                variant={statusInputs[app.id]?.status === option.value ? 'filled' : 'outlined'}
                                color={statusColors[option.value]}
                                sx={{ cursor: 'pointer', borderRadius: 1 }}
                              />
                            ))}
                          </Box>

                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Reason for status update"
                            variant="outlined"
                            value={statusInputs[app.id]?.reason || ''}
                            onChange={(e) => setStatusInputs(prev => ({
                              ...prev,
                              [app.id]: {
                                ...prev[app.id],
                                reason: e.target.value
                              }
                            }))}
                            sx={{ mb: 2 }}
                          />

                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleStatusChange(app)}
                            disabled={!statusInputs[app.id]?.status || !statusInputs[app.id]?.reason}
                            sx={{ borderRadius: 2 }}
                          >
                            Update Status
                          </Button>
                        </Box>
                      ) : (
                        app.status_reason && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>Status Reason</Typography>
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                {app.status_reason}
                              </Typography>
                            </Paper>
                          </Box>
                        )
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
      <ToastContainer />
    </Box>
  );
};

export default Job;