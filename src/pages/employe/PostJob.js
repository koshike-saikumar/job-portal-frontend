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
    const [skillSuggestions, setSkillSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const userId = localStorage.getItem('userId');

    const commonSkills = [
        'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
        'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask',
        'Spring Boot', 'Laravel', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL',
        'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Git',
        'REST API', 'GraphQL', 'Redux', 'MobX', 'Jest', 'Mocha', 'Chai',
        'SASS', 'LESS', 'Webpack', 'Babel', 'Express.js', 'NestJS', '.NET',
        'Swift', 'Kotlin', 'React Native', 'Flutter', 'TensorFlow', 'PyTorch',
        'Machine Learning', 'Data Science', 'Blockchain', 'Solidity', 'Rust',
        'Go', 'Ruby', 'Ruby on Rails', 'Elixir', 'Phoenix', 'DevOps', 'CI/CD',
        'Jenkins', 'Ansible', 'Terraform', 'Linux', 'Bash', 'PowerShell'
    ];

    const jobTypes = [
        'Full-time',
        'Part-time',
        'Contract',
        'Internship',
        'Temporary',
        'Remote'
    ];

    const experienceLevels = [
        'Entry Level',
        'Mid Level',
        'Senior Level',
        'Executive'
    ];

    const handleSkillInputChange = (e) => {
        const value = e.target.value;
        formIk.handleChange(e);

        if (value.length > 1) {
            const filtered = commonSkills.filter(skill =>
                skill.toLowerCase().includes(value.toLowerCase())
            );
            setSkillSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectSkill = (skill) => {
        const currentSkills = formIk.values.skills;
        const newSkills = currentSkills
            ? `${currentSkills}, ${skill}`
            : skill;

        formIk.setFieldValue('skills', newSkills);
        setShowSuggestions(false);
    };

    const submitDetails = async (values) => {
        try {
            const response = await axios.post(config.url.test + 'create-job', {
                ...values,
                postedOn: new Date().toISOString(),
                skills: values.skills // Already a string from your form
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
    };

    const formIk = useFormik({
        initialValues: {
            employeId: userId,
            title: "",
            description: "",
            company: "",
            location: "",
            postedOn: "",
            companyDescription: "",
            jobType: "Full-time",
            skills: "",
            minSalary: "",
            maxSalary: "",
            experienceLevel: "Mid Level",
            applicationDeadline: ""
        },
        onSubmit: submitDetails,
    });

    return (
        <><Navbar />
        <div className="post-job-page">
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

                                    <div className="form-group">
                                        <label>Job Type *</label>
                                        <select
                                            name="jobType"
                                            value={formIk.values.jobType}
                                            onChange={formIk.handleChange}
                                            required
                                            className="form-input"
                                        >
                                            {jobTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Experience Level *</label>
                                        <select
                                            name="experienceLevel"
                                            value={formIk.values.experienceLevel}
                                            onChange={formIk.handleChange}
                                            required
                                            className="form-input"
                                        >
                                            {experienceLevels.map(level => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
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
                                            rows={5}
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
                                            rows={5}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Required Skills (comma separated) *</label>
                                        <input
                                            type="text"
                                            name="skills"
                                            value={formIk.values.skills}
                                            onChange={handleSkillInputChange}
                                            required
                                            className="form-input"
                                            placeholder="e.g. React, Node.js, AWS"
                                        />
                                        {showSuggestions && skillSuggestions.length > 0 && (
                                            <div className="skill-suggestions">
                                                {skillSuggestions.map((skill, index) => (
                                                    <div
                                                        key={index}
                                                        className="suggestion-item"
                                                        onClick={() => selectSkill(skill)}
                                                    >
                                                        {skill}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="salary-group">
                                        <div className="form-group half-width">
                                            <label>Min Salary ($)</label>
                                            <input
                                                type="number"
                                                name="minSalary"
                                                value={formIk.values.minSalary}
                                                onChange={formIk.handleChange}
                                                className="form-input"
                                                placeholder="e.g. 50000"
                                            />
                                        </div>
                                        <div className="form-group half-width">
                                            <label>Max Salary ($)</label>
                                            <input
                                                type="number"
                                                name="maxSalary"
                                                value={formIk.values.maxSalary}
                                                onChange={formIk.handleChange}
                                                className="form-input"
                                                placeholder="e.g. 90000"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Application Deadline</label>
                                        <input
                                            type="date"
                                            name="applicationDeadline"
                                            value={formIk.values.applicationDeadline}
                                            onChange={formIk.handleChange}
                                            className="form-input"
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
        </div></>
    );
}

export default PostJob;