import { getAuthHeader } from '../hooks/useAuth';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/posts`;

export const getAllBlogs = async () => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch blogs.');
    const data = await response.json();
    return data.data || [];
};

export const getMyBlogs = async () => {
    const response = await fetch(`${API_BASE_URL}/my-blogs`, {
        headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch your blogs.');
    const data = await response.json();
    return data.data || [];
};

export const createBlog = async (postData) => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getAuthHeader(),
        body: postData,
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post.');
    }
    return response.json();
};

/**
 * Likes a post.
 * @param {string} postId - The ID of the post to like.
 * @returns {Promise<Object>} The updated post object.
 */
export const likePost = async (postId) => {
    const response = await fetch(`${API_BASE_URL}/${postId}/like`, {
        method: 'PUT',
        headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to like post.');
    return response.json();
};

/**
 * Dislikes a post.
 * @param {string} postId - The ID of the post to dislike.
 * @returns {Promise<Object>} The updated post object.
 */
export const dislikePost = async (postId) => {
    const response = await fetch(`${API_BASE_URL}/${postId}/dislike`, {
        method: 'PUT',
        headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to dislike post.');
    return response.json();
};

/**
 * Fetches a single blog post by its ID.
 * @param {string} postId - The ID of the post to fetch.
 * @returns {Promise<Object>} The blog post object.
 */
export const getBlogById = async (postId) => {
    const response = await fetch(`${API_BASE_URL}/${postId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch the post.');
    }
    const data = await response.json();
    return data.data; // Assuming your backend returns { success, data }
};

/**
 * Deletes a blog post by its ID.
 * @param {string} postId - The ID of the post to delete.
 * @returns {Promise<void>}
 */
export const deleteBlog = async (postId) => {
    const response = await fetch(`${API_BASE_URL}/${postId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
    });

    if (!response.ok) {
        throw new Error('Failed to delete the post.');
    }
};

/**
 * Updates an existing blog post.
 * @param {string} postId - The ID of the post to update.
 * @param {FormData} postData - The form data containing the updated details.
 * @returns {Promise<Object>} The updated post object.
 */
export const updateBlog = async (postId, postData) => {
    const response = await fetch(`${API_BASE_URL}/${postId}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: postData,
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update the post.');
    }
    return data.data;
};