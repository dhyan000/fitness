import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppRoutes from './components/AppRoutes';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
// CHANGE a a a a THE FUNCTION NAME HERE a a a a 
import { fetchAllWorkouts, fetchAllUsers, assignPlanToMember } from './utils/api';

const AppContent = () => {
  const [workouts, setWorkouts] = useState([]);
  const [members, setMembers] = useState([]);
  const { user } = useAuth();

  const loadData = async () => {
    if (user) {
      try {
        // AND a a a a CHANGE THE FUNCTION NAME HERE a a a a 
        const plansData = await fetchAllWorkouts();
        setWorkouts(plansData);
        const usersData = await fetchAllUsers();
        const memberUsers = usersData.filter(user => user.role === 'MEMBER');
        setMembers(memberUsers);
      } catch (error) {
        console.error("Failed to load initial data", error);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleWorkoutAdded = () => {
    loadData(); // Refresh data when a workout is added
  };

  const handleAssignWorkout = async (memberId, workoutId) => {
      try {
          await assignPlanToMember(workoutId, memberId);
          alert(`Assigned plan successfully! The member will see it on their dashboard.`);
      } catch (error) {
          alert(`Failed to assign plan.`);
      }
  };

  return (
    <div className="app-container">
      <Navbar />
      <Header />
      <main className="main-content">
        <AppRoutes 
          workouts={workouts}
          members={members}
          onAssignWorkout={handleAssignWorkout}
          onWorkoutAdded={handleWorkoutAdded}
        />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;