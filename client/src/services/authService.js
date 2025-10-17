// src/services/authService.js

const API_BASE_URL = 'https://blogapp-mern-2.onrender.com/api/v1/auth';

/**
 * Logs in a user.
 * @param {Object} credentials - The user's email and password.
 * @returns {Promise<Object>} A promise that resolves to the login response data (token, user).
 */
export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
    }
    return data;
};

/**
 * Registers a new user.
 * @param {Object} userData - The user's username, email, and password.
 * @returns {Promise<Object>} A promise that resolves to the registration response data (token, user).
 */
export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
    }
    return data;
};