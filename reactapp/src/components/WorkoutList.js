import React, { useState, useEffect, useMemo } from 'react';
import { fetchAllWorkouts } from '../utils/api';
import { formatDate } from '../utils/date';

const ITEMS_PER_PAGE = 5;

const WorkoutList = ({ workouts: propWorkouts, onWorkoutAdded }) => {
    const [workouts, setWorkouts] = useState(propWorkouts || []);
    const [loading, setLoading] = useState(!propWorkouts);
    const [error, setError] = useState('');
    
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);

    // Update workouts when prop changes
    useEffect(() => {
        if (propWorkouts) {
            setWorkouts(propWorkouts);
            setLoading(false);
        }
    }, [propWorkouts]);

    useEffect(() => {
        const getWorkouts = async () => {
            if (propWorkouts) return; // Don't fetch if workouts are provided as props
            
            try {
                setLoading(true);
                const data = await fetchAllWorkouts();
                setWorkouts(data);
                setError('');
            } catch (err) {
                setError('Failed to fetch workouts.');
                console.error('Error fetching workouts:', err);
            } finally {
                setLoading(false);
            }
        };
        getWorkouts();
    }, [propWorkouts]);

    const paginatedAndSortedItems = useMemo(() => {
        let sortableItems = [...workouts];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                
                // Handle date sorting
                if (sortConfig.key === 'date') {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                }
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortableItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [workouts, sortConfig, currentPage]);

    const totalPages = Math.ceil(workouts.length / ITEMS_PER_PAGE);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    if (loading) {
        return (
            <div className="workout-table-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading workouts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="workout-table-container">
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="workout-table-container">
            <div className="workout-header">
                <h2>Workout Log</h2>
                <div className="workout-stats">
                    <span className="stat">
                        <strong>{workouts.length}</strong> Total Workouts
                    </span>
                    <span className="stat">
                        <strong>{workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0)}</strong> Total Calories
                    </span>
                </div>
            </div>
            
            {workouts.length === 0 ? (
                <div className="empty-state">
                    <p>No workouts found. Start by adding your first workout!</p>
                </div>
            ) : (
                <>
                    <div className="table-wrapper">
                        <table className="workout-table">
                            <thead>
                                <tr>
                                    <th onClick={() => requestSort('type')} className="sortable">
                                        Type {sortConfig.key === 'type' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '↕'}
                                    </th>
                                    <th onClick={() => requestSort('workoutName')} className="sortable">
                                        Name {sortConfig.key === 'workoutName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '↕'}
                                    </th>
                                    <th onClick={() => requestSort('duration')} className="sortable">
                                        Duration (min) {sortConfig.key === 'duration' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '↕'}
                                    </th>
                                    <th onClick={() => requestSort('caloriesBurned')} className="sortable">
                                        Calories {sortConfig.key === 'caloriesBurned' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '↕'}
                                    </th>
                                    <th onClick={() => requestSort('date')} className="sortable">
                                        Date {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '↕'}
                                    </th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedAndSortedItems.map((workout) => (
                                    <tr key={workout.id} className="workout-row">
                                        <td>
                                            <span className={`workout-type ${workout.type?.toLowerCase().replace(' ', '-')}`}>
                                                {workout.type || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="workout-name">{workout.workoutName || workout.type || 'N/A'}</td>
                                        <td className="duration">{workout.duration || 0} min</td>
                                        <td className="calories">{workout.caloriesBurned || 0} cal</td>
                                        <td className="date">{formatDate(workout.date)}</td>
                                        <td className="notes">
                                            {workout.notes ? (
                                                <span className="notes-text" title={workout.notes}>
                                                    {workout.notes.length > 30 ? workout.notes.substring(0, 30) + '...' : workout.notes}
                                                </span>
                                            ) : (
                                                <span className="no-notes">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination-controls">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1}
                                className="pagination-btn"
                            >
                                ← Previous
                            </button>
                            <span className="page-info">Page {currentPage} of {totalPages}</span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                disabled={currentPage === totalPages}
                                className="pagination-btn"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default WorkoutList;