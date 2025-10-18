import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

// --- ENSURE THIS EXPORT EXISTS ---
export const getAuthHeader = () => {
    console.log("getAuthHeader: Retrieving token from localStorage...");
    const token = localStorage.getItem('token');
    console.log("getAuthHeader: Token found:", token ? 'Yes' : 'No');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};
// --- END EXPORT CHECK ---

const getStoredUser = () => {
    try {
        const userJson = localStorage.getItem('user');
        if (!userJson) return null;
        return JSON.parse(userJson);
    } catch (err) {
        console.error('useAuth: Failed to parse stored user:', err);
        return null;
    }
};

export const useAuth = () => {
    // Initialize from localStorage with safe try/catch
    let initialUser = null;
    let initialToken = null;
    try {
        initialUser = getStoredUser();
        initialToken = localStorage.getItem('token');
    } catch (e) {
        console.error('useAuth: error reading localStorage', e);
        initialUser = null;
        initialToken = null;
    }

    const [user, setUser] = useState(initialUser);
    const [isAuthenticated, setIsAuthenticated] = useState(!!initialToken);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // mark hook ready
        setIsLoading(false);

        // keep auth in sync across tabs
        const handleStorage = (e) => {
            if (e.key === 'token' || e.key === 'user') {
                setUser(getStoredUser());
                setIsAuthenticated(!!localStorage.getItem('token'));
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const login = useCallback((token, userData) => {
        try {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
        } catch (err) {
            console.error('useAuth.login: failed to persist auth', err);
        }
    }, []);

    const logout = useCallback(() => {
        const headers = getAuthHeader();
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (err) {
            console.error('useAuth.logout: failed to clear localStorage', err);
        }
        setUser(null);
        setIsAuthenticated(false);
        // best-effort notify server
        fetch(`${API_BASE_URL}/auth/logout`, { headers }).catch((err) => console.error('Logout request failed', err));
    }, [API_BASE_URL]); // Ensure dependency is correct

    return { user, isAuthenticated, isLoading, login, logout };
};