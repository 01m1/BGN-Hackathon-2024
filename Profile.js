import React, { useEffect, useState } from 'react';
import './Profile.css';  // Importing the CSS file for styling

const Profile = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [darkMode, setDarkMode] = useState(true);  // State for dark mode toggle
    const [statistics, setStatistics] = useState(null);
    const [personalBests, setPersonalBests] = useState(null);
    const [achievements, setAchievements] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfileStatistics();
        fetchPersonalBests();
        fetchAchievements();
    }, []);

    const fetchProfileStatistics = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5001/api/profileStatistics');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setStatistics(data);  // Update statistics state
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchPersonalBests = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5001/api/personalBests');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPersonalBests(data);  // Update personal bests state
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchAchievements = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5001/api/achievements');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAchievements(data);  // Update achievements state
        } catch (error) {
            setError(error.message);
        }
    };

    // Function to handle profile picture upload
    const handleProfilePicUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setProfilePic(reader.result);  // Store the uploaded image
        };

        if (file) {
            reader.readAsDataURL(file);  // Read the file
        }
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const updateStatistics = async () => {
        try {
            // Increment the current highest streak by 1
            const newStreak = statistics.highestStreak + 1;  
            const newAnswered = Math.floor(Math.random() * 10);  // Random answered between 0-9
            const newCorrect = Math.floor(Math.random() * newAnswered);  // Correct answers should not exceed answered
            const newSpeed = Math.floor(Math.random() * 10);  // Random speed between 0-9

            await fetch('http://127.0.0.1:5001/api/updateStatistics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    streak: newStreak,  // Use incremented streak
                    answered: newAnswered,  // Use new random answered
                    correct: newCorrect,  // Use new random correct
                    speed: newSpeed,  // Use new random speed
                }),
            });

            fetchProfileStatistics(); // Refetch statistics after update
        } catch (error) {
            console.error('Error updating statistics:', error);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={`profile-container ${darkMode ? 'dark' : 'light'}`}>
            {/* Dark Mode Toggle Button */}
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </button>

            {/* EduBytes Logo with cap icon */}
            <div className="logo-container">
                <h1 className="edubytes-logo">
                    EduBytes
                    <span className="grad-icon">🎓</span>
                </h1>
            </div>

            {/* Profile Image or Avatar Selection */}
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

                {/* Upload Profile Picture */}
                <label htmlFor="profile-upload" className="upload-btn">
                    Upload Profile Picture
                </label>
                <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="file-input"
                />
            </div>

            {/* Game Stats Card */}
            <div className="stats-card">
                <h3 className="stats-title">⚡ Current Stats</h3>
                {statistics ? (
                    <>
                        <div className="stat-item">
                            <span>Streak</span>
                            <span>{statistics.highestStreak} 🔥</span>
                        </div>
                        <div className="stat-item">
                            <span>Total Answered</span>
                            <span>{statistics.totalAnswered}</span>
                        </div>
                        <div className="stat-item">
                            <span>Total Correct</span>
                            <span>{statistics.totalCorrect}</span>
                        </div>
                        <div className="stat-item">
                            <span>Total Speed</span>
                            <span>{statistics.totalSpeed} QPS</span>
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
                {/* Add the Update Statistics Button here */}
                <button onClick={updateStatistics} className="update-stats-btn">Update Statistics</button>
            </div>

            {/* Personal Bests Card */}
            <div className="personal-bests-card">
                <h3 className="personal-bests-title">🏅 Personal Bests</h3>
                {personalBests ? (
                    <>
                        <div className="stat-item">
                            <span>Best Streak</span>
                            <span>{personalBests.bestStreak} 🔥</span>
                        </div>
                        <div className="stat-item">
                            <span>Best Speed</span>
                            <span>{personalBests.bestSpeed}</span>
                        </div>
                        <div className="stat-item">
                            <span>Best Accuracy</span>
                            <span>{personalBests.bestAccuracy}</span>
                        </div>
                    </>
                ) : (
                    <p>Loading Personal Bests...</p>
                )}
            </div>

            {/* Achievements Card */}
            <div className="achievements-card">
                <h3 className="achievements-title">🏆 Achievements</h3>
                {achievements ? (
                    achievements.map((achievement) => (
                        <div key={achievement.id} className={`achievement-item ${achievement.unlocked ? 'unlocked' : ''}`}>
                            {achievement.unlocked ? (
                                <span>✅ {achievement.name}</span>
                            ) : (
                                <span>🔒 {achievement.name}</span>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Loading Achievements...</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
















































