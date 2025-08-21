import React, { useState } from 'react';
import WorkoutList from './WorkoutList';
import AddWorkoutForm from './AddWorkoutForm';
import MemberManagement from './MemberManagement';
import MemberProgressList from './MemberProgressList';
import './TrainerDashboard.css'; // Import the new CSS

const TrainerDashboard = ({ workouts, members, onAssignWorkout, onWorkoutAdded }) => {
    const [view, setView] = useState('workouts');
    const [listKey, setListKey] = useState(Date.now());

    return (
        <div className="trainer-dashboard-container">
            <h1>Trainer Dashboard</h1>
            <div className="dashboard-nav">
                <button onClick={() => setView('progress')} className={view === 'progress' ? 'active' : ''}>
                    Member Progress
                </button>
                <button onClick={() => setView('workouts')} className={view === 'workouts' ? 'active' : ''}>
                    Manage Workouts
                </button>
                <button onClick={() => setView('add')} className={view === 'add' ? 'active' : ''}>
                    Add Workout
                </button>
                <button onClick={() => setView('assign')} className={view === 'assign' ? 'active' : ''}>
                    Assign Workouts
                </button>
            </div>
            <div className="dashboard-content">
                {view === 'progress' && <MemberProgressList assignments={[]} />}
                {view === 'workouts' && <WorkoutList key={listKey} workouts={workouts} onWorkoutAdded={() => setListKey(Date.now())} />}
                {view === 'add' && <AddWorkoutForm onWorkoutAdded={() => {
                    setListKey(Date.now());
                    if (onWorkoutAdded) onWorkoutAdded();
                }} />}
                {view === 'assign' && <MemberManagement members={members} workouts={workouts} onAssignWorkout={onAssignWorkout} />}
            </div>
        </div>
    );
};

export default TrainerDashboard;