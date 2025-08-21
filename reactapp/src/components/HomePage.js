import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // <-- This line is crucial. Make sure it's here.

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Welcome to My Fitness Tracker App</h1>
                <p>Your personal journey to a healthier lifestyle starts here.</p>
                <div className="home-buttons">
                    <Link to="/login" className="home-button">Login</Link>
                    <Link to="/register" className="home-button">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;