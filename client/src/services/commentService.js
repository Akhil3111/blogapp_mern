import { getAuthHeader } from '../hooks/useAuth';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/comments`;

/**
 * Gets all comments for a specific post.
 * @param {string} postId - The ID of the post to fetch comments for.
 * @returns {Promise<Array>} Array of comment objects.
 */
export const getCommentsForPost = async (postId) => {
    const response = await fetch(`${API_BASE_URL}/${postId}`);
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch comments.');
    }
    
    const data = await response.json();
    return data.data;
};

/**
 * Adds a new comment to a post.
 * @param {string} postId - The ID of the post to comment on.
 * @param {Object} commentData - Comment data containing content.
 * @returns {Promise<Object>} The created comment object.
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

/**
 * Updates an existing comment.
 * @param {string} commentId - The ID of the comment to update.
 * @param {Object} commentData - An object containing the updated content.
 * @returns {Promise<Object>} The updated comment object.
 */
export const updateComment = async (commentId, commentData) => {
    const response = await fetch(`${API_BASE_URL}/${commentId}`, {
        method: 'PUT',
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update comment.');
    }
    return data.data;
};

/**
 * Deletes a comment.
 * @param {string} commentId - The ID of the comment to delete.
 * @returns {Promise<void>}
 */
export const deleteComment = async (commentId) => {
    const response = await fetch(`${API_BASE_URL}/${commentId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete comment.');
    }
};