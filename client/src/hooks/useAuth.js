import { useState, useEffect, useCallback } from 'react';

// Updated to production API URL
const API_BASE_URL = 'https://blogapp-mern-2.onrender.com/api/v1';

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const getStoredUser = () => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
};

export const useAuth = () => {
    const [user, setUser] = useState(getStoredUser());
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const login = useCallback((token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(() => {
        const headers = getAuthHeader();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        fetch(`${API_BASE_URL}/auth/logout`, { headers }).catch(console.error);
    }, []);

    return { user, isAuthenticated, isLoading, login, logout };
};