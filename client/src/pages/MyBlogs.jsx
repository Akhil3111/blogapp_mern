import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ServerCrash, FileText, Plus } from 'lucide-react';
import { getMyBlogs, deleteBlog } from '../services/blogService';
import PostCard from '../components/PostCard';
import ConfirmationModal from '../components/common/ConfirmationModal';

const MyBlogs = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for managing the delete confirmation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Callback to update a single post in the state
    const handlePostUpdate = useCallback((updatedPost) => {
        setPosts(currentPosts => 
            currentPosts.map(p => p._id === updatedPost._id ? updatedPost : p)
        );
    }, []);

    // Fetches the user's posts
    const fetchUserPosts = useCallback(async () => {
        try {
            setLoading(true);
            const fetchedPosts = await getMyBlogs();
            setPosts(fetchedPosts);
        } catch (err) {
            setError('Could not load your posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserPosts();
    }, [fetchUserPosts]);

    // Opens the confirmation modal
    const handleDeleteClick = (postId) => {
        setPostToDelete(postId);
        setIsModalOpen(true);
    };

    // Closes the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPostToDelete(null);
    };

    // Confirms and executes the deletion
    const handleConfirmDelete = async () => {
        if (!postToDelete) return;
        setIsDeleting(true);
        try {
            await deleteBlog(postToDelete);
            setPosts(currentPosts => currentPosts.filter(p => p._id !== postToDelete));
            handleCloseModal();
        } catch (err) {
            console.error("Failed to delete post:", err);
            // Optionally, you can set an error message to display to the user
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return <div className="w-full h-full flex justify-center items-center p-10"><Loader2 className="w-12 h-12 animate-spin text-gray-400" /></div>;
    }
    if (error) {
        return <div className="w-full h-full flex flex-col justify-center items-center text-center p-10"><ServerCrash className="w-16 h-16 text-red-500 mb-4" /><h2 className="text-2xl font-bold text-gray-800">An Error Occurred</h2><p className="text-gray-600 mt-2">{error}</p></div>;
    }

    return (
        <div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Delete"
                isLoading={isDeleting}
            />

            <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">My Blogs</h1>
                <p className="mt-1 text-gray-600">Manage, edit, and view all of your published posts.</p>
            </div>
            
            {posts.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">You haven't written anything yet</h3>
                    <p className="text-gray-500 mt-2 mb-6">Click the button below to create your first blog post!</p>
                    <Link
                        to="/add-blog"
                        className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Post
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {posts.map(post => (
                        <PostCard 
                            key={post._id} 
                            post={post} 
                            onPostUpdate={handlePostUpdate}
                            onDeleteClick={handleDeleteClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBlogs;