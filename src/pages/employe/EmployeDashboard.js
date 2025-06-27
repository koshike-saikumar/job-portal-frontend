import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeDashboard.css';
import Navbar from './component/Navbar'
import axios from 'axios';
import { config } from '../../CommonApi/CommonApis';

const EmployeDashboard = () => {
  const [jobs, setJobs] = useState([]);
    const [status, setStatus] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const name = "Koshike Saikumar"//localStorage.getItem('loggedInUser');



function getJobs() {
        axios.get(config.url.test+'jobs?employeId=2').then((response) => {
                          console.log('data1:  ',response.data.status)
                setStatus(response.data.status);

            if (response.data.status === true) {
                const data = response.data.jobs;
                console.log('data2:  ',data)
                setJobs(data);

            } else {
                setJobs([]);
            }
        });
    }

 useEffect(() => {
        getJobs()
    }, []);











  // useEffect(() => {
  //   // Fetch jobs posted by the employer
  //   const fetchJobs = async () => {
  //     const token = localStorage.getItem('token');

  //     if (!token) {
  //       setMessage('No token found. Please login.');
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const response = await fetch('https://shreyansh1807.bsite.net/api/Job/my-jobs', {
  //         method: 'GET',
  //         headers: {
  //           'Authorization': `Bearer ${token}`
  //         }
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch jobs. Status: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       setJobs(data);
  //     } catch (error) {
  //       setMessage(error.message);
  //     }

  //     setLoading(false);
  //   };

  //   fetchJobs();
  // }, []);

  // // Function to handle job card click
  // const handleJobClick = (id) => {
  //   navigate(`/employer/job/${id}`);
  // };

  return (
    <div>
            <Navbar />

    <div className="dashboard-container">
      <h3 class="text-center mt-3">Hello <span className='text-primary'>"{name}"</span></h3>
      <h2>My Posted Jobs</h2>
      {status === false ? (
<p style={{ textAlign: "center", marginTop: "50px", fontSize: "18px", color: "#555" }}>
  No jobs posted yet.
</p>
      ) : (
        <div className="job-card-grid">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="job-card"
              // onClick={() => handleJobClick(job.id)}
            >
              <h5>{job.title}</h5>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p className="truncate"><strong>Description:</strong> {job.description}</p>
              <p><strong>Posted On:</strong> {job.posted_on}</p>
            </div>
          ))}
        </div>  
      )}
    </div>
    </div>
  );
};

export default EmployeDashboard;
