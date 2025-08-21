import React, { useState } from 'react';

const MemberManagement = ({ members, workouts, onAssignWorkout }) => {
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [selectedWorkoutId, setSelectedWorkoutId] = useState('');

    const handleAssign = (e) => {
        e.preventDefault();
        if (selectedMemberId && selectedWorkoutId) {
            onAssignWorkout(Number(selectedMemberId), Number(selectedWorkoutId));
            setSelectedMemberId('');
            setSelectedWorkoutId('');
        } else {
            alert('Please select a member and a workout.');
        }
    };

    return (
        <div className="member-management-container">
            <h2>Assign Workouts</h2>
            <form onSubmit={handleAssign} className="assignment-form">
                <div className="form-group">
                    <label>Select Member:</label>
                    <select value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)}>
                        <option value="">-- Select Member --</option>
                        {members.map(member => (
                            <option key={member.id} value={member.id}>{member.username}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Select Workout Plan:</label>
                    <select value={selectedWorkoutId} onChange={(e) => setSelectedWorkoutId(e.target.value)}>
                        <option value="">-- Select Workout --</option>
                        {workouts.map(workout => (
                            <option key={workout.id} value={workout.id}>{workout.title}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Assign Workout</button>
            </form>
        </div>
    );
};
export default MemberManagement;
