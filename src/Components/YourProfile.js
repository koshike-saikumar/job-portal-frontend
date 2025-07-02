import React, { useState, useEffect, useCallback } from 'react';
import { FiEdit2, FiSave, FiX, FiLock, FiUser, FiMail, FiCheckCircle } from 'react-icons/fi';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';
import { config } from '../CommonApi/CommonApis';
import './YourProfile.css';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../pages/employe/component/Navbar';
import Navba from '../pages/employe/component/Navbar';
import Navbar from '../pages/jobseeker/component/Navbar';

function YourProfile() {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState(false);
    const userId = localStorage.getItem('userId');
    // const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    // const name = localStorage.getItem('name');
    // const navigate = useNavigate();


    const getProfile = useCallback(() => {
    setLoading(true);
    axios.get(`${config.url.test}user-details?id=${userId}`)
      .then((response) => {
        setStatus(response.data.status);
        if (response.data.status === true) {
          const user = response.data.user[0];
          setProfile(user);
          setFormData({
            name: user.name,
            email: user.email,
            password: '' // Don't pre-fill password
          });
        }
      })
      .catch((error) => {
        setMessage({ text: 'Failed to load profile', type: 'error' });
        console.error('Error fetching profile:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]); // ✅ Only include userId as a dependency

  useEffect(() => {
    getProfile();
  }, [getProfile]);

    const handleUpdate = async () => {
        if (formData.password && !validatePassword(formData.password)) {
            setMessage({
                text: "Password must be at least 6 characters with one number and one special character",
                type: "error"
            });
            return;
        }

        setLoading(true);
        try {
            const requestBody = {
                name: formData.name,
                id: profile.id,
                ...(formData.password && { password: formData.password })
            };

            const response = await axios.post(config.url.test + 'update-profile', requestBody);

            if (response.data.code === "01") {
                setMessage({
                    text: 'Profile updated successfully!',
                    type: "success"
                });
                getProfile();
                setEditMode(false);
            } else {
                setMessage({
                    text: response.data.message || "Update failed",
                    type: "error"
                });
            }
        } catch (error) {
            setMessage({
                text: "An error occurred. Please try again.",
                type: "error"
            });
            console.error("Error during profile update:", error);
        } finally {
            setLoading(false);
        }
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;
        return regex.test(password);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleEdit = () => {
        if (!editMode) {
            setFormData({
                name: profile.name,
                email: profile.email,
                password: ''
            });
        }
        setEditMode(!editMode);
        setMessage({ text: '', type: '' });
    };

    const getRoleText = (role) => {
        switch (role) {
            case 1: return 'Employer';
            case 2: return 'Job Seeker';
            default: return 'Unknown';
        }
    };

    return (
        <>
            {role === '1' ? <Navba /> :
                <Navbar />}


            <div className="profile-container">
                {/* <div className="profile-header-wrapper">
                    <button
                        className="back-button top-right"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                </div> */}
                <div className="profile-card">


                    <div className="profile-header">
                        <h2>My Profile</h2>
                        {!editMode && (
                            <button onClick={toggleEdit} className="edit-btn" disabled={loading}>
                                <FiEdit2 /> Edit Profile
                            </button>
                        )}
                    </div>

                    {message.text && (
                        <div className={`alert alert-${message.type}`}>
                            {message.type === 'success' && <FiCheckCircle />}
                            {message.text}
                        </div>
                    )}

                    {loading ? (
                        <div className="loader-container">
                            <PulseLoader color="#6366f1" size={12} />
                            <span>Loading your profile...</span>
                        </div>
                    ) : status === false ? (
                        <div className="error-message">
                            Could not load profile data. Please try again later.
                        </div>
                    ) : (
                        <>
                            <div className="avatar-section">
                                <div className="avatar">
                                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="avatar-info">
                                    <h3>{profile.name}</h3>
                                    <p className="role-badge">{getRoleText(profile.role)}</p>
                                </div>
                            </div>

                            <div className="profile-details">
                                <div className="form-group">
                                    <label>
                                        <FiUser className="icon" /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editMode ? formData.name : profile.name}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                        className={editMode ? 'edit-mode' : ''}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <FiMail className="icon" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                    />
                                </div>

                                {editMode && (
                                    <div className="form-group">
                                        <label>
                                            <FiLock className="icon" /> New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Leave blank to keep current password"
                                            autoComplete="new-password"
                                            className="edit-mode"
                                        />
                                        <div className="password-hint">
                                            Password must be at least 6 characters with one number and one special character
                                        </div>
                                    </div>
                                )}
                            </div>

                            {editMode && (
                                <div className="action-buttons">
                                    <button onClick={toggleEdit} className="cancel-btn">
                                        <FiX /> Cancel
                                    </button>
                                    <button onClick={handleUpdate} className="save-btn" disabled={loading}>
                                        {loading ? (
                                            <PulseLoader color="#fff" size={6} />
                                        ) : (
                                            <>
                                                <FiSave /> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default YourProfile;