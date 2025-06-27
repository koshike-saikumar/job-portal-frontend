import React, { useState } from 'react';
import Navbar from './component/Navbar';
import './PostJob.css';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../utils';
import { FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import { config } from '../../CommonApi/CommonApis';

function PostJob() {
    const [message, setMessage] = useState('');

    const submitDetails = async (values) => {
        try {
            const response = await axios.post(config.url.test + 'create-job', {
                ...values,
                postedOn: new Date().toISOString()
            });
            
            if (response.data.code === "01") {
                setMessage('Job posted successfully!');
                handleSuccess(response.data.message);
                formIk.resetForm();
            } else {
                setMessage(response.data.message);
                handleError(response.data.message);
            }
        } catch (e) {
            console.error("Error during job posting:", e);
            handleError("An error occurred. Please try again.");
        }
    }

    const formIk = useFormik({
        initialValues: {
            employeId: 2,
            title: "",
            description: "",
            company: "",
            location: "",
            postedOn: "",
            companyDescription: ""
        },
        onSubmit: submitDetails,
    });

    return (
        <div className="post-job-page">
            <Navbar />
            <div className="post-job-container">
                <div className="post-job-card">
                    <div className="post-job-header">
                        <h2>Post a New Job Opportunity</h2>
                        <p className="subtitle">Fill in the details below to attract top talent</p>
                    </div>
                    
                    {message && (
                        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}
                    
                    <FormikProvider value={formIk}>
                        <form onSubmit={formIk.handleSubmit} className="job-form">
                            <div className="form-columns">
                                <div className="form-column left">
                                    <div className="form-group">
                                        <label>Employer ID</label>
                                        <input
                                            type="text"
                                            name="employeId"
                                            disabled
                                            value={formIk.values.employeId}
                                            className="form-input"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Job Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formIk.values.title}
                                            onChange={formIk.handleChange}
                                            required
                                            className="form-input"
                                            placeholder="e.g. Senior React Developer"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Company Name *</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formIk.values.company}
                                            onChange={formIk.handleChange}
                                            required
                                            className="form-input"
                                            placeholder="Your company name"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Location *</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formIk.values.location}
                                            onChange={formIk.handleChange}
                                            required
                                            className="form-input"
                                            placeholder="e.g. Remote, New York, etc."
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-column right">
                                    <div className="form-group">
                                        <label>Job Description *</label>
                                        <textarea
                                            name="description"
                                            value={formIk.values.description}
                                            onChange={formIk.handleChange}
                                            required
                                            className="form-textarea"
                                            placeholder="Describe the responsibilities, requirements, and benefits..."
                                            rows={6}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>About Your Company *</label>
                                        <textarea
                                            name="companyDescription"
                                            value={formIk.values.companyDescription}
                                            onChange={formIk.handleChange}
                                            required
                                            className="form-textarea"
                                            placeholder="Tell candidates about your company culture, mission, etc."
                                            rows={6}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-actions">
                                <button type="submit" className="submit-button">
                                    Post Job Opportunity
                                </button>
                            </div>
                        </form>
                    </FormikProvider>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
}

export default PostJob;