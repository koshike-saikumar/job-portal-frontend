import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Card, Col, Row, Spin, Tag, Typography, Input, message } from 'antd';
// import SearchComponent from './component/SearchComponent';
// import MyApplications from './MyApplications';
import Navbar from './component/Navbar';
import './JobseekerDashboard.css';
import axios from 'axios';
import { config } from '../../CommonApi/CommonApis';
import { handleError, handleSuccess } from '../utils';

const { Title, Text } = Typography;
const { TextArea } = Input;

const JobseekerDashboard = () => {
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const userId = localStorage.getItem('userId');
  const [applicationForm, setApplicationForm] = useState({
    phone: '',
    experience: '',
    education: '',
    resumeUrl: '',
    coverLetter: ''
  });

  const basedOnSkills = useCallback(() => {
  setLoading(true);
  axios.get(`${config.url.test}basedon-skills?skills=react&jobSeekerId=${userId}`)
    .then((response) => {
      if (response.data.status === true) {
        setJobs(response.data.data);
      } else {
        setJobs([]);
        handleError("No jobs found matching skills");
      }
    })
    .catch(error => {
      handleError("An error occurred. Please try again.");
      console.error('Error fetching jobs:', error);
    })
    .finally(() => {
      setLoading(false);
    });
}, [userId]); // ✅ removed handleError


  useEffect(() => {
    basedOnSkills();
  }, [basedOnSkills]);
  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleSubmitApplication = async () => {
    if (!applicationForm.phone || !applicationForm.experience || !applicationForm.education || !applicationForm.resumeUrl) {
      message.error('Please fill all required fields');
      return;
    }

    const applicationData = {
      jobSeekerId: userId,
      jobId: selectedJob.id,
      name: name,
      email: email,
      phone: applicationForm.phone,
      experience: applicationForm.experience,
      education: applicationForm.education,
      resumeUrl: applicationForm.resumeUrl,
      coverLetter: applicationForm.coverLetter,
    };

    try {
      setLoading(true);
      const response = await axios.post(config.url.test + 'apply-job', applicationData);

      if (response.data.code === "01") {
        handleSuccess(response.data.message);
        setShowModal(false);
        // Reset form
        setApplicationForm({
          phone: '',
          experience: '',
          education: '',
          resumeUrl: '',
          coverLetter: ''

        });
        basedOnSkills();
      } else {
        handleError(response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      message.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Title level={2}>Welcome back, <span className="text-primary">{name}</span></Title>
          <Text type="secondary">Here are jobs matching your skills</Text>
        </div>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <div className="jobs-section">
            <Title level={4}>Recommended Jobs</Title>
            <Row gutter={[16, 16]}>
              {jobs.length > 0 ? (
                jobs.map((job, index) => (
                  <Col key={index} xs={24} sm={12} lg={8}>
                    <Card
                      title={job.title}
                      bordered={false}
                      hoverable
                      className="job-card"
                      extra={<Tag color={new Date(job.application_deadline) >= new Date() ? 'green' : 'red'}>
                        {/* {formatDate(selectedJob?.application_deadline) >= new Date() ? 'Active' : 'Closed'} */}

                        {new Date(job.application_deadline) >= new Date() ? 'Active' : 'Closed'}
                      </Tag>}
                    >
                      <div className="job-meta">
                        <Text strong>{job.company}</Text>
                        <Text type="secondary">{job.location}</Text>
                      </div>
                      <div className="job-salary">
                        <Text>${job.min_salary} - ${job.max_salary}</Text>
                      </div>
                      <div className="job-type">
                        <Tag color="blue">{job.job_type}</Tag>
                        <Tag color="purple">{job.experience_level}</Tag>
                      </div>
                      <div className="job-skills">
                        {job.skills.split(',').map((skill, i) => (
                          <Tag key={i} color="geekblue">{skill.trim()}</Tag>
                        ))}
                      </div>
                      <div className="job-description">
                        <Text ellipsis={{ rows: 3 }}>{job.description}</Text>
                      </div>
                      <div className="job-footer">
                        <Text type="secondary">Posted: {formatDate(job.posted_on)}</Text>
                        <Text type="secondary">Deadline: {formatDate(job.application_deadline)}</Text>
                      </div>
                      <Button
                        type="primary"
                        block
                        style={{ marginTop: 16 }}
                        onClick={() => handleApplyClick(job)}
                        disabled={!job.job_status}
                      >
                        {job.job_status ? 'Apply Now' : 'Alredy Applied'}
                      </Button>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <Card>
                    <Text>No jobs found matching your skills. Please update your profile with relevant skills.</Text>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        )}
      </div>

      {/* Application Modal */}
      <Modal
        title={<span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Apply for {selectedJob?.title}</span>}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={800}
        centered
        bodyStyle={{ padding: 0 }}
      >
        <div className="modal-content">
          {/* Job Header */}
          <div className="modal-header" style={{
            background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
            color: 'white',
            padding: '20px',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <Text strong style={{ color: 'white', fontSize: '1.2rem' }}>{selectedJob?.company}</Text>
              <Tag color={new Date(selectedJob?.application_deadline) >= new Date() ? 'green' : 'red'}>
                {/* {formatDate(job.application_deadline)} */}
                {new Date(selectedJob?.application_deadline) >= new Date() ? 'Active' : 'Closed'}
              </Tag>
            </div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Location</Text>
                <Text strong style={{ color: 'white', display: 'block' }}>{selectedJob?.location}</Text>
              </div>
              <div>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Salary</Text>
                <Text strong style={{ color: 'white', display: 'block' }}>${selectedJob?.min_salary} - ${selectedJob?.max_salary}</Text>
              </div>
              <div>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Posted</Text>
                <Text strong style={{ color: 'white', display: 'block' }}>{selectedJob && formatDate(selectedJob.posted_on)}</Text>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
            <div style={{ marginBottom: '20px' }}>
              <Title level={5} style={{ marginBottom: '10px' }}>Job Description</Title>
              <Text>{selectedJob?.description}</Text>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <Title level={5} style={{ marginBottom: '10px' }}>Required Skills</Title>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedJob?.skills.split(',').map((skill, i) => (
                  <Tag key={i} color="blue">{skill.trim()}</Tag>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px', backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
              <Title level={5} style={{ marginBottom: '10px' }}>About the Company</Title>
              <Text>{selectedJob?.company_description}</Text>
            </div>

            {/* Application Form */}
            <Title level={4} style={{ marginBottom: '20px' }}>Application Form</Title>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Full Name</Text>
              <Input value={name} disabled style={{ marginTop: '8px' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Email</Text>
              <Input value={email} disabled style={{ marginTop: '8px' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Phone Number *</Text>
              <Input
                name="phone"
                value={applicationForm.phone}
                onChange={handleInputChange}
                placeholder="+1 (123) 456-7890"
                style={{ marginTop: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Years of Experience *</Text>
              <Input
                name="experience"
                value={applicationForm.experience}
                onChange={handleInputChange}
                placeholder="e.g. 5 years"
                style={{ marginTop: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Education *</Text>
              <Input
                name="education"
                value={applicationForm.education}
                onChange={handleInputChange}
                placeholder="e.g. Bachelor's in Computer Science"
                style={{ marginTop: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Resume URL *</Text>
              <Input
                name="resumeUrl"
                value={applicationForm.resumeUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/your-resume.pdf"
                style={{ marginTop: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Cover Letter (Optional)</Text>
              <TextArea
                name="coverLetter"
                value={applicationForm.coverLetter}
                onChange={handleInputChange}
                placeholder="Tell us why you're a good fit for this position..."
                rows={4}
                style={{ marginTop: '8px' }}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
          }}>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleSubmitApplication}
              disabled={!applicationForm.phone || !applicationForm.experience ||
                !applicationForm.education || !applicationForm.resumeUrl}
            >
              Submit Application
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default JobseekerDashboard;