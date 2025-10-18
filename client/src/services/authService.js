import { getAuthHeader } from '../hooks/useAuth'; // Ensure getAuthHeader is exported

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

// --- (loginUser and registerUser functions remain the same) ---
export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed.');
    return data; // Returns { success, token, user }
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed.');
    return data; // Returns { success, token, user }
};

// --- CORRECTED FUNCTION: Get current user profile and posts ---
/**
 * Fetches the currently logged-in user's profile information and their posts.
 * @returns {Promise<Object>} An object containing 'user' and 'posts' keys.
 */
export const getUserProfile = async (page = 1, limit = 6) => {
    const res = await fetch(`${API_BASE_URL}/me?page=${page}&limit=${limit}`, {
        headers: getAuthHeader(),
    });

    let data;
    try {
        data = await res.json();
    } catch (err) {
        throw new Error('Invalid server response while fetching profile.');
    }

    if (!res.ok) {
        console.error('Error fetching profile:', data);
        throw new Error(data.message || data.error || 'Failed to fetch profile.');
    }

    // Backend returns { success: true, user: {...}, posts: { data: [], totalPages, currentPage } }
    return data;
};