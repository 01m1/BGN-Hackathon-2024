import React, { useEffect, useState } from 'react';
import './css/Profile.css';
import Navbar from './Navbar';

const Profile = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [darkMode, setDarkMode] = useState(true);
    const [statistics, setStatistics] = useState(null);
    const [error, setError] = useState(null);
    const [personalBests, setPersonalBests] = useState(null);
    const [achievements, setAchievements] = useState(null);

    useEffect(() => {
        fetchProfileStatistics();
    }, []);

    const fetchProfileStatistics = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/profileStatistics');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setStatistics(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleProfilePicUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setProfilePic(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className={`profile-container ${darkMode ? 'dark' : 'light'}`}>
            <Navbar />
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </button>

            <div className="logo-container">
                <h1 className="edubytes-logo">
                    EduBytes<span className="grad-icon">🎓</span>
                </h1>
            </div>

            <div className="header">
                <div className="profile-picture">
                    {profilePic ? (
                        <img src={profilePic} alt="Profile Pic" className="profile-image" />
                    ) : (
                        <div className="profile-image-placeholder">
                            <span role="img" aria-label="avatar">👤</span>
                        </div>
                    )}
                </div>

                <h2 className="profile-title">Profile</h2>
                <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="file-input"
                />
            </div>

            <div className="stats-card">
                <h3 className="stats-title">⚡ Current Stats</h3>
                {statistics ? (
                    <>
                        <div className="stat-item">
                            <span>Streak</span>
                            <span>6 🔥</span>
                        </div>
                        <div className="stat-item">
                            <span>Total Answered</span>
                            <span>20</span>
                        </div>
                        <div className="stat-item">
                            <span>Total Correct</span>
                            <span>9</span>
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>

             {/* Personal Bests Card */}
            <div className="personal-bests-card">
                <h3 className="personal-bests-title">🏅 Personal Bests</h3>
                    <>
                        <div className="stat-item">
                            <span>Best Streak</span>
                            <span>6 🔥</span>
                        </div>
                        <div className="stat-item">
                            <span>Best Speed</span>
                            <span>4 per minute</span>
                        </div>
                        <div className="stat-item">
                            <span>Best Accuracy</span>
                            <span>46.89%</span>
                        </div>
                    </>

            </div>

        </div>
    );
};

export default Profile;
