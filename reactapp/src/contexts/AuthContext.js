import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, logout as apiLogout } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for user data in localStorage on initial load
        const userData = localStorage.getItem('fitnessUser');
        
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setUser(user);
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('fitnessUser');
            }
        }
        
        setLoading(false);
    }, []);

    const login = (data) => {
        // Store user data in localStorage
        if (data && data.user) {
            localStorage.setItem('fitnessUser', JSON.stringify(data.user));
            setUser(data.user);
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            // Clear user data from localStorage
            localStorage.removeItem('fitnessUser');
            setUser(null);
        }
    };

    const refreshUser = async () => {
        try {
            const userData = await getCurrentUser();
            localStorage.setItem('fitnessUser', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Error refreshing user:', error);
            // If we can't get the current user, they might be logged out
            localStorage.removeItem('fitnessUser');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);