
import { format } from 'date-fns';
import { DATE_FORMAT } from './constant';

/**
 * Format a date string to a user-friendly format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
};

/**
 * Format a date string to include time
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date time:', error);
        return 'Invalid Date';
    }
};

/**
 * Get today's date in YYYY-MM-DD format for input fields
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

/**
 * Check if a date is in the future
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (dateString) => {
    if (!dateString) return false;
    
    try {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        
        return date > today;
    } catch (error) {
        return false;
    }
};

/**
 * Get relative time string (e.g., "2 days ago", "1 week ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
        return `${Math.floor(diffInDays / 365)} years ago`;
    } catch (error) {
        return 'Invalid Date';
    }
};