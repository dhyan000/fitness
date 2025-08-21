import axios from 'axios';
import { API_BASE_URL } from './constant';

// Create and export the apiClient instance with credentials support
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true // This is crucial for session cookies
});

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear any stored auth data on 401
            localStorage.removeItem('authToken');
            localStorage.removeItem('fitnessUser');
            
            // Redirect to login if not already there
            if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// --- Workout API Calls ---
export const fetchAllWorkouts = async () => {
    try {
        console.log('Fetching workouts from:', apiClient.defaults.baseURL + '/workouts');
        const response = await apiClient.get('/workouts');
        console.log('Workouts response:', response);
        
        // Handle the new response format
        if (response.data && response.data.workouts) {
            return response.data.workouts;
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching workouts:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        throw error;
    }
};

export const fetchWorkoutById = async (id) => {
    try {
        const response = await apiClient.get(`/workouts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching workout:', error);
        throw error;
    }
};

export const createWorkout = async (workoutData) => {
    try {
        const response = await apiClient.post('/workouts', workoutData);
        return response.data;
    } catch (error) {
        console.error('Error creating workout:', error);
        throw error;
    }
};

export const updateWorkout = async (id, workoutData) => {
    try {
        const response = await apiClient.put(`/workouts/${id}`, workoutData);
        return response.data;
    } catch (error) {
        console.error('Error updating workout:', error);
        throw error;
    }
};

export const deleteWorkout = async (id) => {
    try {
        await apiClient.delete(`/workouts/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting workout:', error);
        throw error;
    }
};

// --- Authentication API Calls ---
export const login = async ({ identifier, password }) => {
    try {
        const response = await apiClient.post('/auth/login', { identifier, password });
        
        // Store user data in localStorage for frontend state management
        if (response.data && response.data.user) {
            localStorage.setItem('fitnessUser', JSON.stringify(response.data.user));
        }
        
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error;
        }
        throw { response: { data: { message: 'Login failed. Please try again.' } } };
    }
};

export const register = async (userData) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await apiClient.post('/auth/logout');
    } catch (error) {
        console.error('Error during logout:', error);
    } finally {
        // Clear local storage regardless of API call success
        localStorage.removeItem('authToken');
        localStorage.removeItem('fitnessUser');
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get('/auth/user');
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
    }
};

// --- User API Calls ---
export const fetchAllUsers = async () => {
    try {
        const response = await apiClient.get('/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const fetchUserById = async (id) => {
    try {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await apiClient.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        await apiClient.delete(`/users/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// --- Assignment API Calls ---
export const assignPlanToMember = async (planId, memberId) => {
    try {
        const payload = { planId, memberId };
        const response = await apiClient.post('/assignments', payload);
        return response.data;
    } catch (error) {
        console.error('Error assigning workout plan:', error);
        throw error;
    }
};

export const getAssignmentsForMember = async (memberId) => {
    try {
        const response = await apiClient.get(`/assignments/member/${memberId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching assignments:', error);
        throw error;
    }
};

export const updateAssignmentStatus = async (progressId, status) => {
    try {
        const payload = { status };
        const response = await apiClient.put(`/assignments/${progressId}/status`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating assignment status:', error);
        throw error;
    }
};

export const updateAssignmentProgress = async (progressId, completionPercentage) => {
    try {
        const payload = { completionPercentage };
        const response = await apiClient.put(`/assignments/${progressId}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating assignment progress:', error);
        throw error;
    }
};

export const deleteAssignment = async (progressId) => {
    try {
        await apiClient.delete(`/assignments/${progressId}`);
        return true;
    } catch (error) {
        console.error('Error deleting assignment:', error);
        throw error;
    }
};