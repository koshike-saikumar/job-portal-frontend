import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeDashboard.css';
import Navbar from './component/Navbar';
import axios from 'axios';
import { config } from '../../CommonApi/CommonApis';
import { FiBriefcase, FiCalendar, FiMapPin, FiFileText, FiClock } from 'react-icons/fi';
import { PulseLoader } from 'react-spinners';
import { handleError } from '../utils';

const EmployeDashboard = () => {  
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const name = localStorage.getItem('loggedInUser') || "Koshike Saikumar";

  function getJobs() {
    setLoading(true);
    axios.get(config.url.test + 'jobs?employeId=2')
      .then((response) => {
        console.log('data1:  ', response.data.status);
        setStatus(response.data.status);

        if (response.data.status === true) {
          const data = response.data.jobs;
          console.log('data2:  ', data);
          setJobs(data);
        } else {
          setJobs([]);
        }
      })
      .catch(error => {
        // setMessage('Failed to fetch jobs. Please try again later.');
        handleError("An error occurred. Please try again.");
        console.error('Error fetching jobs:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getJobs();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, <span className="text-primary">{name}</span></h1>
            <p className="subtitle">Here are your posted job listings</p>
          </div>
          <div className="stats-card">
            <div className="stat-item">
              <FiBriefcase className="stat-icon" />
              <div>
                <h3>{jobs.length}</h3>
                <p>Total Jobs</p>
              </div>
            </div>
            <div className="stat-item">
              <FiClock className="stat-icon" />
              <div>
                <h3>{jobs.filter(job => new Date(job.deadline) > new Date()).length}</h3>
                <p>Active Jobs</p>
              </div>
            </div>
          </div>
        </header>

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
            <button className="primary-button" onClick={() => navigate('/post-job')}>
              Post a Job
            </button>
          </div>
        ) : (
          <div className="job-card-grid">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <h3>{job.title}</h3>
                  <span className={`job-status ${new Date(job.deadline) > new Date() ? 'active' : 'expired'}`}>
                    {new Date(job.deadline) > new Date() ? 'Active' : 'Expired'}
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
                  </div>
                  <div className="job-description">
                    <FiFileText className="desc-icon" />
                    <p>{job.description}</p>
                  </div>
                </div>
                <div className="job-card-footer">
                  <button className="secondary-button" onClick={() => navigate(`/job/${job.id}/applications`)}>
                    View Applications
                  </button>
                  <button className="primary-button" onClick={() => navigate(`/job/${job.id}/edit`)}>
                    Edit Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeDashboard;