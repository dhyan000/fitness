import React from 'react';

const MemberProgressList = ({ assignments }) => {
    // Add null checking to prevent undefined errors
    if (!assignments || assignments.length === 0) {
        return (
            <div>
                <h2>All Member Progress</h2>
                <div className="progress-list">
                    <p>No workouts have been assigned to members yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2>All Member Progress</h2>
            <div className="progress-list">
                {assignments.map(item => (
                    <div key={item.id} className="progress-card">
                        <h3>{item.memberName}</h3>
                        <p><strong>Plan:</strong> {item.workoutTitle}</p>
                        <p><strong>Status:</strong> {item.progressStatus}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemberProgressList;