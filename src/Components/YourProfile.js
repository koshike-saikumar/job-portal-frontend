import React, { useState, useEffect } from 'react';
import { FiEdit2, FiSave, FiX, FiLock, FiUser, FiMail, FiBriefcase } from 'react-icons/fi';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';
import { config } from '../CommonApi/CommonApis';
import './YourProfile.css';
import Navbar from '../pages/employe/component/Navbar';


function YourProfile() {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState(false);

    const getProfile = () => {
        setLoading(true);
        axios.get(config.url.test + 'user-details?email=9l7hovlloy@qacmjeq.com')
            .then((response) => {
                setStatus(response.data.status);
                if (response.data.status === true) {
                    setProfile(response.data.user[0]);
                    setFormData({
                        name: response.data.user[0].name,
                        email: response.data.user[0].email,
                        password: ''
                    });
                }
            })
            .catch(error => {
                setMessage({ text: 'Failed to load profile', type: 'error' });
                console.error('Error fetching profile:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getProfile();
    }, []);

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
                getProfile(); // Refresh profile data
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
        <div>
            <Navbar />

            <div className="profile-page">

                <div className="profile-container">
                    <h2>My Profile</h2>


                    {message.text && (
                        <div className={`message message-${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    {loading ? (
                        <div className="loading-container">
                            <PulseLoader color="#4f46e5" size={10} />
                            <p>Loading profile...</p>
                        </div>
                    ) : status === false ? (
                        <div className="error-state">
                            <p>Could not load profile data. Please try again later.</p>
                        </div>
                    ) : (
                        <div className="profile-content">
                            <div className="profile-avatar">
                                <div className="avatar-circle">
                                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <FiUser className="input-icon" /> Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editMode ? formData.name : profile.name}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <FiMail className="input-icon" /> Email
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <FiBriefcase className="input-icon" /> Role
                                </label>
                                <input
                                    type="text"
                                    value={getRoleText(profile.role)}
                                    disabled
                                />
                            </div>

                            {editMode && (
                                <div className="form-group">
                                    <label>
                                        <FiLock className="input-icon" /> New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Leave blank to keep current password"
                                        autoComplete="new-password"
                                    />
                                    <div className="password-hint">
                                        Must be at least 6 characters with one number and one special character
                                    </div>
                                </div>
                            )} <div className="profile-header">
                                {!editMode && (
                                    <button
                                        onClick={toggleEdit}
                                        className="edit-button"
                                        disabled={loading}
                                    >
                                        <FiEdit2 /> Edit Profile
                                    </button>
                                )}
                            </div>
                            {editMode && (
                                <div className="action-buttons">
                                    <button
                                        onClick={toggleEdit}
                                        className="cancel-button"
                                        disabled={loading}
                                    >
                                        <FiX /> Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        className="save-button"
                                        disabled={loading}
                                    >
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default YourProfile;