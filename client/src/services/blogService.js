import { getAuthHeader } from '../hooks/useAuth';

const API_BASE_URL = 'https://blogapp-mern-2.onrender.com/api/v1/blogs';

/**
 * Fetches all published blog posts.
 * @returns {Promise<Array>} A promise that resolves to an array of posts.
 */
export const getAllBlogs = async () => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch blogs.');
    }
    const data = await response.json();
    return data.blogs || []; // Ensure we return an array
};

/**
 * Fetches only the blogs created by the currently logged-in user.
 * @returns {Promise<Array>} A promise that resolves to an array of the user's posts.
 */
export const getMyBlogs = async () => {
    const response = await fetch(`${API_BASE_URL}/my-blogs`, {
        headers: getAuthHeader(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch your blogs.');
    }
    const data = await response.json();
    return data.blogs || [];
};

/**
 * Creates a new blog post.
 * @param {FormData} postData - The form data containing post details and the thumbnail image.
 * @returns {Promise<Object>} A promise that resolves to the newly created post object.
 */
export const createBlog = async (postData) => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getAuthHeader(),
        body: postData, // FormData for multipart/form-data (file upload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post.');
    }
    return response.json();
};