// JobDetailsModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './JobDetailsModal.css';

const JobDetailsModal = ({ job, show, onHide, onApply }) => {












  

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{job.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h5 className="text-primary">{job.company}</h5>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <span><i className="bi bi-geo-alt"></i> {job.location}</span>
            <span><i className="bi bi-calendar"></i> Posted on: {new Date(job.posted_on).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mb-4">
          <h6>Job Description:</h6>
          <p>{job.description}</p>
        </div>

        <div className="mb-4">
          <h6>About Company:</h6>
          <p>{job.company_description}</p>
        </div>

        <div className="mb-4">
          <h6>Requirements:</h6>
          <ul>
            {job.requirements && job.requirements.split('\n').map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button 
        // variant="primary" 
        // onClick={() => onApply(job.id)}
        >
          Apply Now
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JobDetailsModal;