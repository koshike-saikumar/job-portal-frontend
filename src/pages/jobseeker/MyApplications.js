import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { config } from '../../CommonApi/CommonApis';
import { handleError } from '../utils';
import Navbar from './component/Navbar';
import './MyApplications.css';
import {
  Card, Modal,
  Typography,
  Button,
  Chip,
  Paper,
  LinearProgress,
  Skeleton,
  Box,
  Avatar, Grid
} from '@mui/material';
import {
  ArrowBack,
  Description,
  Event,
  Schedule,
  Business,
  LocationOn,
  Work,
  School,
  Phone,
  Email,
  Money,
  AccessTime,
  Person
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const getAppliedJobs = () => {
      setLoading(true);
      axios.get(config.url.test + 'applied-jobs?jobSeekerId=' + userId)
        .then((response) => {
          if (response.data.status === true) {
            setApplications(response.data.data);
          } else {
            setApplications([]);
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
    getAppliedJobs();
  }, [userId]);
  // useEffect(() => {
  //   getAppliedJobs();
  // }, [getAppliedJobs]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatSalary = (amount) => {
    if (!amount) return 'Not disclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'accepted': return 'success';
      case 'reviewed': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Under Review';
      case 'rejected': return 'Not Selected';
      case 'accepted': return 'Selected';
      case 'reviewed': return 'In Process';
      default: return status;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="applications-container">
        <header className="applications-header">
          <Typography variant="h4" component="h1" fontWeight={600}>
            My Applications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your job applications and their status
          </Typography>
        </header>

        {loading ? (
          <div className="loading-state">
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                width="100%"
                height={180}
                sx={{ mb: 2, borderRadius: 2 }}
              />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/images/no-applications.svg"
              alt="No applications"
              width={200}
              height={200}
            />
            <Typography variant="h6" fontWeight={500} mt={2}>
              No applications found
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              You haven't applied to any jobs yet
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/jobseeker/jobs')}
              sx={{ borderRadius: 2 }}
            >
              Browse Available Jobs
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="applications-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {applications.map((app) => (
              <motion.div
                key={app.id}
                variants={cardVariants}
                whileHover={{ y: -3 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <div className="application-card-content">
                    <div className="application-card-header">
                      <div>
                        <Typography variant="h6" fontWeight={600}>
                          {app.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                        >
                          <Business fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                          {app.company}
                          <LocationOn fontSize="small" sx={{ ml: 1.5, mr: 0.5, opacity: 0.7 }} />
                          {app.location}
                        </Typography>
                      </div>
                      <Chip
                        label={getStatusLabel(app.status)}
                        color={getStatusColor(app.status)}
                        size="small"
                        sx={{
                          textTransform: 'capitalize',
                          fontWeight: 500
                        }}
                      />
                    </div>

                    {/* Added Salary and Experience Info */}
                    <div className="application-meta">
                      <div className="meta-item">
                        <Money fontSize="small" sx={{ opacity: 0.6, mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatSalary(app.min_salary)} - {formatSalary(app.max_salary)}
                        </Typography>
                      </div>
                      <div className="meta-item">
                        <Work fontSize="small" sx={{ opacity: 0.6, mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {app.experience_level}
                        </Typography>
                      </div>
                      <div className="meta-item">
                        <AccessTime fontSize="small" sx={{ opacity: 0.6, mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(app.posted_on)}
                        </Typography>
                      </div>
                    </div>

                    {/* Added Skills Chips */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, my: 1.5 }}>
                      {app.skills?.split(',').slice(0, 3).map((skill, i) => (
                        <Chip
                          key={i}
                          label={skill.trim()}
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      ))}
                      {app.skills?.split(',').length > 3 && (
                        <Chip
                          label={`+${app.skills.split(',').length - 3}`}
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      )}
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={
                        app.status?.toLowerCase() === 'pending' ? 30 :
                          app.status?.toLowerCase() === 'reviewed' ? 50 :
                            ['accepted', 'rejected'].includes(app.status?.toLowerCase()) ? 100 : 20
                      }
                      color={getStatusColor(app.status)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        my: 1.5,
                        backgroundColor: 'rgba(0,0,0,0.05)'
                      }}
                    />

                    <div className="application-details">
                      <div className="detail-row">
                        <Event fontSize="small" sx={{ opacity: 0.6 }} />
                        <Typography variant="body2" color="text.secondary">
                          Applied: {formatDate(app.applied_at)}
                        </Typography>
                      </div>
                      <div className="detail-row">
                        <Schedule fontSize="small" sx={{ opacity: 0.6 }} />
                        <Typography variant="body2" color="text.secondary">
                          Updated: {formatDate(app.status_updated_at)}
                        </Typography>
                      </div>
                    </div>

                    <div className="application-actions">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Description />}
                        onClick={() => {
                          setSelectedApplication(app);
                          setOpenModal(true);
                        }}
                        sx={{ borderRadius: 2 }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Application Details Modal */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          sx={{ backdropFilter: 'blur(2px)' }}
        >
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '95%', sm: '90%', md: '800px' },
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              p: 0,
              outline: 'none'
            }}
          >
            {selectedApplication && (
              <>
                <div className="modal-header">
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={() => setOpenModal(false)}
                    sx={{ color: 'white' }}
                  >
                    Back
                  </Button>
                  <Chip
                    label={getStatusLabel(selectedApplication.status)}
                    color={getStatusColor(selectedApplication.status)}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      fontWeight: 500
                    }}
                  />
                </div>

                <div className="modal-content">
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                      {selectedApplication.title.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        {selectedApplication.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                      >
                        <Business fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                        {selectedApplication.company}
                        <LocationOn fontSize="small" sx={{ ml: 2, mr: 1, opacity: 0.7 }} />
                        {selectedApplication.location}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Application Status Section */}
                  <div className="section">
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                      Application Status
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={
                        selectedApplication.status?.toLowerCase() === 'pending' ? 30 :
                          selectedApplication.status?.toLowerCase() === 'reviewed' ? 50 :
                            ['accepted', 'rejected'].includes(selectedApplication.status?.toLowerCase()) ? 100 : 20
                      }
                      color={getStatusColor(selectedApplication.status)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        mb: 3,
                        backgroundColor: 'rgba(0,0,0,0.05)'
                      }}
                    />
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                      Current Status: {getStatusLabel(selectedApplication.status)}
                    </Typography>
                    {selectedApplication.status_reason && (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: 'rgba(0,0,0,0.02)',
                          borderLeft: '3px solid',
                          borderColor: `${getStatusColor(selectedApplication.status)}.main`,
                          mb: 3
                        }}
                      >
                        <Typography variant="body2">
                          {selectedApplication.status_reason}
                        </Typography>
                      </Paper>
                    )}
                  </div>

                  {/* Job Details Section */}
                  <div className="section">
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                      Job Details
                    </Typography>
                    <Grid container spacing={2} mb={3}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Box display="flex" alignItems="center">
                          <Money fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                          <Typography variant="body2">
                            <strong>Salary:</strong> {formatSalary(selectedApplication.min_salary)} - {formatSalary(selectedApplication.max_salary)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Box display="flex" alignItems="center">
                          <Work fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                          <Typography variant="body2">
                            <strong>Experience:</strong> {selectedApplication.experience_level}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Box display="flex" alignItems="center">
                          <AccessTime fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                          <Typography variant="body2">
                            <strong>Deadline:</strong> {formatDate(selectedApplication.application_deadline)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                      Required Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                      {selectedApplication.skills?.split(',').map((skill, i) => (
                        <Chip
                          key={i}
                          label={skill.trim()}
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      ))}
                    </Box>

                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                      Job Description
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        mb: 3
                      }}
                    >
                      <Typography variant="body1" whiteSpace="pre-line">
                        {selectedApplication.description || 'No job description available.'}
                      </Typography>
                    </Paper>
                  </div>

                  {/* Your Application Section */}
                  <div className="section">
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                      Your Application
                    </Typography>
                    <Grid container spacing={2} mb={3}>
                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Person fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                          <Typography variant="body2">
                            <strong>Name:</strong> {selectedApplication.name}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Email fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                          <Typography variant="body2">
                            <strong>Email:</strong> {selectedApplication.email}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Phone fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                          <Typography variant="body2">
                            <strong>Phone:</strong> {selectedApplication.phone}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Work fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                          <Typography variant="body2">
                            <strong>Experience:</strong> {selectedApplication.experience}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                          <School fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                          <Typography variant="body2">
                            <strong>Education:</strong> {selectedApplication.education}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <Event fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                          <Typography variant="body2">
                            <strong>Applied:</strong> {formatDate(selectedApplication.applied_at)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                      Cover Letter
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        mb: 3
                      }}
                    >
                      <Typography variant="body1" whiteSpace="pre-line">
                        {selectedApplication.cover_letter || 'No cover letter provided.'}
                      </Typography>
                    </Paper>

                    <Button
                      variant="contained"
                      startIcon={<Description />}
                      href={selectedApplication.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      disabled={!selectedApplication.resume_url}
                      sx={{ borderRadius: 2 }}
                    >
                      View Resume
                    </Button>
                  </div>

                  <div className="modal-actions">
                    <Button
                      variant="contained"
                      onClick={() => setOpenModal(false)}
                      sx={{ borderRadius: 2 }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Paper>
        </Modal>
      </div>
    </>
  );
};

export default MyApplications;