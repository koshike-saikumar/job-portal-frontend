import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeDashboard.css';
import Navbar from './component/Navbar';
import axios from 'axios';
import { config } from '../../CommonApi/CommonApis';
import { FiBriefcase, FiCalendar, FiMapPin, FiFileText, FiClock, FiBarChart2, FiPieChart } from 'react-icons/fi';
import { PulseLoader } from 'react-spinners';
import { handleError } from '../utils';
import { Badge } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FiUsers } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,  
  Legend,
  ArcElement
);

const JobList = ({ jobs, navigate, emptyMessage = "No jobs found" }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        <img src="/images/no-jobs.svg" alt="No jobs" className="empty-image" />
        <h3>{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className="job-card-grid">
      {jobs.map((job) => (
        <div key={job.id} className="job-card">
          <div className="job-card-header">
            <h3>{job.title}</h3>
            <span className={`job-status ${new Date(job.application_deadline) > new Date() ? 'active' : 'expired'}`}>
              {new Date(job.application_deadline) > new Date() ? 'Active' : 'Expired'}
            </span>
          </div>
          <div className="job-card-body">
            <div className="job-meta">
              <span className="meta-item">
                <FiBriefcase className="meta-icon" />
                {job.company}
              </span>
              <span className="meta-item">
                <FiMapPin className="meta-icon" />
                {job.location}
              </span>
              <span className="meta-item">
                <FiCalendar className="meta-icon" />
                Posted: {formatDate(job.posted_on)}
              </span>
              <span className="meta-item">
                <FiPieChart className="meta-icon" />
                {job.job_type}
              </span>
            </div>
            <div className="job-description">
              <FiFileText className="desc-icon" />
              <p>{job.description}</p>
            </div>
            <div className="job-skills">
              <strong>Skills: </strong>
              {job.skills}
            </div>
          </div>
          <div className="job-card-footer">
            {job?.application_no === 0 ? (
              <div className="error-message">No applications yet</div>
            ) : (
              <button
                className="secondary-button"
                onClick={() => {
                  navigate(`/employe-job`);
                  localStorage.setItem('id', job?.id);
                }}
              >
                View Applications
                <Badge
                  badgeContent={job?.application_no === 0 ? "0" : job?.application_no} 
                  color="error"
                  sx={{ ml: 1 }}
                />	
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const EmployeDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  // const email = localStorage.getItem('email');
  const name = localStorage.getItem('name');

 const getJobs = useCallback(() => {
    setLoading(true);
    axios.get(`${config.url.test}jobs?employeId=${userId}`)
      .then((response) => {
        setStatus(response.data.status);
        if (response.data.status === true) {
          setJobs(response.data.jobs);
        } else {
          setJobs([]);
        }
      })
      .catch(error => {
        handleError("An error occurred. Please try again.");
        console.error('Error fetching jobs:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]); 

  useEffect(() => {
    getJobs();
  }, [getJobs]);

  // Prepare data for charts
  const getChartData = () => {
    // Applications by job
    const jobTitles = jobs.map(job => job.title);
    const applicationsData = jobs.map(job => job.application_no);

    // Jobs by type
    const jobTypeCounts = jobs.reduce((acc, job) => {
      acc[job.job_type] = (acc[job.job_type] || 0) + 1;
      return acc;
    }, {});

    return {
      applicationsChart: {
        labels: jobTitles,
        datasets: [
          {
            label: 'Applications',
            data: applicationsData,
            backgroundColor: 'rgba(79, 70, 229, 0.7)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 1,
          },
        ],
      },
      jobTypesChart: {
        labels: Object.keys(jobTypeCounts),
        datasets: [
          {
            data: Object.values(jobTypeCounts),
            backgroundColor: [
              'rgba(79, 70, 229, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(239, 68, 68, 0.7)',
            ],
            borderColor: [
              'rgba(79, 70, 229, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(239, 68, 68, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
    };
  };

  const chartData = getChartData();

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, <span className="text-primary">{name}</span></h1>
            <p className="subtitle">Here are your posted job listings and analytics</p>
          </div>
          <div className="stats-card">
            <div className="stat-item">
              <div className="stat-icon-container">
                <FiBriefcase className="stat-icon" />
              </div>
              <div className="stat-text">
                <h3>{jobs.length}</h3>
                <p>Total Jobs</p>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon-container">
                <FiClock className="stat-icon" />
              </div>
              <div className="stat-text">
                <h3>{jobs.filter(job => new Date(job.application_deadline) > new Date()).length}</h3>
                <p>Active Jobs</p>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon-container">
                <FiUsers className="stat-icon" />
              </div>
              <div className="stat-text">
                <h3>{jobs.reduce((sum, job) => sum + job.application_no, 0)}</h3>
                <p>Total Applications</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="analytics-tabs">
          <button 
            className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <FiBriefcase className="tab-icon" /> All Jobs
          </button>
          <button 
            className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <FiClock className="tab-icon" /> Active Jobs
          </button>
          <button 
            className={`tab-button ${activeTab === 'applicants' ? 'active' : ''}`}
            onClick={() => setActiveTab('applicants')}
          >
            <FiUsers className="tab-icon" /> Job Applicants
          </button>
          <button 
            className={`tab-button ${activeTab === 'no-applicants' ? 'active' : ''}`}
            onClick={() => setActiveTab('no-applicants')}
          >
            <FiFileText className="tab-icon" /> No Applicants
          </button>
          <button 
            className={`tab-button ${activeTab === 'expired' ? 'active' : ''}`}
            onClick={() => setActiveTab('expired')}
          >
            <FiCalendar className="tab-icon" /> Expired Jobs
          </button>
          <button 
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <FiBarChart2 className="tab-icon" /> Analytics
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <PulseLoader color="#4f46e5" size={15} />
            <p>Loading your job listings...</p>
          </div>
        ) : status === false ? (
          <div className="empty-state">
            <img src="/images/no-jobs.svg" alt="No jobs posted" className="empty-image" />
            <h3>No jobs posted yet</h3>
            <p>You haven't posted any job listings yet. Get started by creating your first job post.</p>
            <button className="primary-button" onClick={() => navigate('/employe-postjob')}>
              Post a Job
            </button>
          </div>
        ) : activeTab === 'list' ? (
          <JobList jobs={jobs} navigate={navigate} />
        ) : activeTab === 'active' ? (
          <JobList 
            jobs={jobs.filter(job => new Date(job.application_deadline) > new Date())} 
            navigate={navigate} 
            emptyMessage="No active jobs found"
          />
        ) : activeTab === 'applicants' ? (
          <JobList 
            jobs={jobs.filter(job => job.application_no > 0)} 
            navigate={navigate} 
            emptyMessage="No jobs with applicants found"
          />
        ) : activeTab === 'no-applicants' ? (
          <JobList 
            jobs={jobs.filter(job => job.application_no === 0)} 
            navigate={navigate} 
            emptyMessage="All your jobs have applicants"
          />
        ) : activeTab === 'expired' ? (
          <JobList 
            jobs={jobs.filter(job => new Date(job.application_deadline) <= new Date())} 
            navigate={navigate} 
            emptyMessage="No expired jobs found"
          />
        ) : (
          <div className="analytics-container">
            <div className="chart-card">
              <h3>Applications by Job</h3>
              <div className="chart-wrapper">
                <Bar 
                  data={chartData.applicationsChart}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                  }}
                />
              </div>
            </div>
            
            <div className="chart-card">
              <h3>Job Types Distribution</h3>
              <div className="chart-wrapper">
                <Pie 
                  data={chartData.jobTypesChart}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeDashboard;  