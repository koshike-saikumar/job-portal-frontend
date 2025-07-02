import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Spinner } from 'react-bootstrap';
import { config } from '../../CommonApi/CommonApis';
import { handleError } from '../utils';


const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('title');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); 
 function getJobs() {
    setLoading(true);
    axios.get(config.url.test + 'jobs?employeId=2')
      .then((response) => {
        console.log('data1:  ', response.data.status);
        // setStatus(response.data.status);

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
//   useEffect(() => {
//     // Fetch jobs based on the search term
//     const fetchJobs = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`https://shreyansh1807.bsite.net/api/Job/search?title=${encodeURIComponent(searchTerm)}`);
//         setJobs(response.data);
//       } catch (error) {
//         console.error('Failed to fetch jobs:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (searchTerm) fetchJobs();
//   }, [searchTerm]);

  const columns = [
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true
    },
    {
      name: 'Company',
      selector: row => row.company,
      sortable: true
    },
    {
      name: 'Location',
      selector: row => row.location,
      sortable: true
    },
    {
      name: 'Posted On',
      selector: row => new Date(row.postedOn).toLocaleDateString(),
      sortable: true
    },
    {
      name: 'Actions',
      cell: row => (
        <button
          onClick={() => navigate(`/jobseeker/jobs/${row.id}`)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          View
        </button>
      )
    }
  ];

  return (
    <div className="w-100vw p-5 mt-4">
      <h3>Search Results for: "{searchTerm}"</h3>
      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      ) : jobs.length === 0 ? (
        <p>No jobs found matching your search.</p>
      ) : (
        <DataTable
          columns={columns}
          data={jobs}
          pagination
          highlightOnHover
          striped
          responsive
        />
      )}
    </div>
  );
};

export default SearchResults;
