import { getAuthHeader } from '../hooks/useAuth';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/comments`;

/**
 * Fetches all comments for a specific post.
 * @param {string} postId - The ID of the post.
 * @returns {Promise<Array>} An array of comment objects.
 */
export const getCommentsForPost = async (postId) => {
    const response = await fetch(`${API_BASE_URL}/${postId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch comments.');
    }
    const data = await response.json();
    return data.data || []; // Assuming your backend returns { success, data }
};

/**
 * Adds a new comment to a post.
 * @param {string} postId - The ID of the post to comment on.
 * @param {Object} commentData - An object containing the comment text, e.g., { text: "Great post!" }.
 * @returns {Promise<Object>} The newly created comment object.
 */
export const addCommentToPost = async (postId, commentData) => {
    const response = await fetch(`${API_BASE_URL}/${postId}`, {
        method: 'POST',
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to add comment.');
    }
    return data.data;
};