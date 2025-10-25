// client/src/services/blogService.js

import { getAuthHeader } from '../hooks/useAuth';

// Corrected: Ensure API_BASE_URL points to the blog/post-related endpoints
// Based on your usage, it looks like your backend handles posts under /posts
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/posts`;

/**
 * Fetches published blog posts with pagination.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of posts per page.
 * @returns {Promise<Object>} Object containing posts and pagination info.
 */
export const getAllBlogs = async (page = 1, limit = 6) => {
    const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`);

    if (!response.ok) {
        let errorMsg = 'Failed to fetch blogs.';
        try { const errorData = await response.json(); errorMsg = errorData.error || errorMsg; } catch (e) { /* ignore */ }
        throw new Error(errorMsg);
    }

    const data = await response.json();

    if (data && data.success) {
        return {
            posts: data.data || [],
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalPosts: data.totalPosts
        };
    } else {
        console.error("Unexpected response structure from getAllBlogs:", data);
        // Return a default structure to prevent app crashes if backend response is malformed
        return { posts: [], currentPage: 1, totalPages: 1, totalPosts: 0 };
    }
};

/**
 * Fetches user's blog posts with pagination.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of posts per page.
 * @returns {Promise<Object>} Object containing posts and pagination info.
 */
export const getMyBlogs = async (page = 1, limit = 6) => {
    // Corrected to use fetch API consistent with your other functions
    const response = await fetch(`${API_BASE_URL}/my-blogs?page=${page}&limit=${limit}`, {
        headers: getAuthHeader(), // This will include the Authorization header
    });

    if (!response.ok) {
        let errorMsg = 'Failed to fetch your blogs.';
        try { const errorData = await response.json(); errorMsg = errorData.message || errorMsg; } catch (e) { /* ignore */ }
        throw new Error(errorMsg);
    }
    const data = await response.json();

    if (data && data.success) {
        return {
            posts: data.data || [],
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalPosts: data.totalPosts
        };
    } else {
        console.error("Unexpected response structure from getMyBlogs:", data);
        // Return a default structure to prevent app crashes if backend response is malformed
        return { posts: [], currentPage: 1, totalPages: 1, totalPosts: 0 };
    }
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
    if (!response.ok) {
        const errorData = await response.json(); // Attempt to read error message
        throw new Error(errorData.message || 'Failed to like post.');
    }
    const data = await response.json();
    return data.data; // <--- Return data.data
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
    if (!response.ok) {
        const errorData = await response.json(); // Attempt to read error message
        throw new Error(errorData.message || 'Failed to dislike post.');
    }
    const data = await response.json();
    return data.data; // <--- Return data.data
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