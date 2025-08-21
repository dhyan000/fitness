import React, { useState } from 'react';
import { createWorkout } from '../utils/api';
import { getTodayDate, isFutureDate } from '../utils/date';

const AddWorkoutForm = ({ onWorkoutAdded }) => {
    const [formData, setFormData] = useState({
        workoutName: '',
        type: '',
        duration: '',
        caloriesBurned: '',
        date: getTodayDate(),
        notes: ''
    });
    
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.workoutName.trim()) {
            newErrors.workoutName = 'Workout name is required';
        }
        
        if (!formData.type.trim()) {
            newErrors.type = 'Workout type is required';
        }
        
        if (!formData.duration || formData.duration <= 0) {
            newErrors.duration = 'Duration must be greater than 0';
        }
        
        if (!formData.caloriesBurned || formData.caloriesBurned < 0) {
            newErrors.caloriesBurned = 'Calories burned must be 0 or greater';
        }
        
        if (!formData.date) {
            newErrors.date = 'Date is required';
        } else if (isFutureDate(formData.date)) {
            newErrors.date = 'Date cannot be in the future';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const workoutData = {
                ...formData,
                duration: Number(formData.duration),
                caloriesBurned: Number(formData.caloriesBurned)
            };
            
            await createWorkout(workoutData);
            setSuccess('Workout added successfully!');
            
            // Reset form
            setFormData({
                workoutName: '',
                type: '',
                duration: '',
                caloriesBurned: '',
                date: getTodayDate(),
                notes: ''
            });
            
            if (onWorkoutAdded) {
                onWorkoutAdded();
            }
            
        } catch (err) {
            console.error('Error adding workout:', err);
            if (err.response?.data?.message) {
                setErrors({ general: err.response.data.message });
            } else {
                setErrors({ general: 'Failed to add workout. Please try again.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-workout-form">
            <h2>Add New Workout</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="workoutName">Workout Name *</label>
                    <input
                        type="text"
                        id="workoutName"
                        name="workoutName"
                        value={formData.workoutName}
                        onChange={handleChange}
                        placeholder="e.g., Morning Run"
                        className={errors.workoutName ? 'error' : ''}
                    />
                    {errors.workoutName && <span className="error-message">{errors.workoutName}</span>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="type">Workout Type *</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className={errors.type ? 'error' : ''}
                    >
                        <option value="">Select workout type</option>
                        <option value="Running">Running</option>
                        <option value="Cycling">Cycling</option>
                        <option value="Swimming">Swimming</option>
                        <option value="Weight Training">Weight Training</option>
                        <option value="Yoga">Yoga</option>
                        <option value="Pilates">Pilates</option>
                        <option value="HIIT">HIIT</option>
                        <option value="Walking">Walking</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.type && <span className="error-message">{errors.type}</span>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="duration">Duration (minutes) *</label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="e.g., 30"
                        min="1"
                        className={errors.duration ? 'error' : ''}
                    />
                    {errors.duration && <span className="error-message">{errors.duration}</span>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="caloriesBurned">Calories Burned *</label>
                    <input
                        type="number"
                        id="caloriesBurned"
                        name="caloriesBurned"
                        value={formData.caloriesBurned}
                        onChange={handleChange}
                        placeholder="e.g., 300"
                        min="0"
                        className={errors.caloriesBurned ? 'error' : ''}
                    />
                    {errors.caloriesBurned && <span className="error-message">{errors.caloriesBurned}</span>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="date">Date *</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        max={getTodayDate()}
                        className={errors.date ? 'error' : ''}
                    />
                    {errors.date && <span className="error-message">{errors.date}</span>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any notes about the workout..."
                        rows="3"
                    />
                </div>
                
                {errors.general && <div className="error-message general">{errors.general}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <button type="submit" disabled={isSubmitting} className="submit-btn">
                    {isSubmitting ? 'Adding Workout...' : 'Add Workout'}
                </button>
            </form>
        </div>
    );
};

export default AddWorkoutForm;
