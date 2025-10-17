import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

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
    }, [API_BASE_URL]);

    return { user, isAuthenticated, isLoading, login, logout };
};