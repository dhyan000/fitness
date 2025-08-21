import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';
import TrainerDashboard from './TrainerDashboard';
import MemberDashboard from './MemberDashboard';
import HomePage from './HomePage'; // Import the new HomePage

const AppRoutes = (props) => {
    const { user } = useAuth();

    const Dashboard = () => {
        // This logic remains the same
        if (!user) return <Navigate to="/" />; // Redirect to home if not logged in
        return user.role === 'TRAINER' 
            ? <TrainerDashboard {...props} onWorkoutAdded={props.onWorkoutAdded} /> 
            : <MemberDashboard {...props} />;
    };

    return (
        <Routes>
            {/* If the user is logged out, the "/" path now shows the HomePage */}
            <Route path="/" element={!user ? <HomePage /> : <Dashboard />} />
            
            {/* If the user is logged out, show Login, otherwise redirect to dashboard */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

            {/* A dedicated route for the dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* A catch-all route that redirects to the appropriate main page */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;