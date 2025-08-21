import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAssignmentsForMember, updateAssignmentStatus } from '../utils/api';
import './MemberDashboard.css'; // Import the new CSS

const MemberDashboard = () => {
    const { user } = useAuth();
    const [myAssignments, setMyAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAssignments = useCallback(async () => {
        if (user) {
            try {
                setLoading(true);
                const assignments = await getAssignmentsForMember(user.id);
                setMyAssignments(assignments);
            } catch (err) {
                setError('Failed to load assigned workout plans.');
            } finally {
                setLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    const handleUpdateStatus = async (progressId, status) => {
        try {
            await updateAssignmentStatus(progressId, status);
            fetchAssignments();
        } catch (err) {
            alert('Failed to update status. Please try again.');
        }
    };

    if (loading) return <p>Loading your dashboard...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="member-dashboard-container">
            <h1>My Dashboard</h1>
            <h2>Assigned Workout Plans</h2>
            <div className="progress-list">
                {myAssignments.length > 0 ? (
                    myAssignments.map(item => (
                        <div key={item.progressId} className="progress-card">
                            <h3>{item.workout.workoutName}</h3>
                            <p>Status: <strong>{item.status}</strong></p>
                            <div className="progress-actions">
                                <button onClick={() => handleUpdateStatus(item.progressId, 'Completed')} className="complete-btn">Completed</button>
                                <button onClick={() => handleUpdateStatus(item.progressId, 'Will complete')} className="will-complete-btn">Will complete</button>
                                <button onClick={() => handleUpdateStatus(item.progressId, 'Skipped today')} className="skipped-btn">Skipped today</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No workout plans have been assigned to you yet.</p>
                )}
            </div>
        </div>
    );
};

export default MemberDashboard;