// client/src/pages/Dashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, ServerCrash, FileText, LayoutGrid, User } from 'lucide-react'; // Added LayoutGrid and User icons
import { getAllBlogs, deleteBlog, getMyBlogs } from '../services/blogService'; // Import getMyBlogs
import PostCard from '../components/PostCard';
import ConfirmationModal from '../components/common/ConfirmationModal';
import PaginationControls from '../components/common/PaginationControls';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify'; // Added toast for better feedback

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, isAuthenticated } = useAuth(); // Destructure isAuthenticated

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Active Tab state: 'all-posts' or 'my-posts'
    const [activeTab, setActiveTab] = useState('all-posts'); // Default to all posts

    // Delete modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handlePostUpdate = useCallback((updatedPost) => {
        setPosts((prev) => prev.map(p => (p._id === updatedPost._id ? updatedPost : p)));
    }, []);

    // --- New fetch function that dynamically calls all or my blogs ---
    const fetchPosts = useCallback(async (pageToFetch = 1, tab) => {
        try {
            setLoading(true);
            setError(null);
            let data;
            if (tab === 'my-posts' && isAuthenticated) {
                // Fetch only current user's blogs
                data = await getMyBlogs(pageToFetch);
            } else {
                // Fetch all blogs
                data = await getAllBlogs(pageToFetch);
            }
            setPosts(data.posts || []);
            setCurrentPage(data.currentPage || pageToFetch);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('fetchPosts error:', err);
            setError('Could not load posts. Please try again later.');
            toast.error(err.message || 'Failed to fetch posts.');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]); // isAuthenticated is a dependency here

    useEffect(() => {
        // Reset page to 1 when tab changes
        setCurrentPage(1);
        fetchPosts(1, activeTab);
    }, [activeTab, fetchPosts]);

    // Open confirmation modal
    const handleDeleteClick = (postId) => {
        setPostToDelete(postId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPostToDelete(null);
        setIsDeleting(false);
    };

    const handleConfirmDelete = async () => {
        if (!postToDelete) return;
        setIsDeleting(true);
        try {
            await deleteBlog(postToDelete);
            // After deletion, re-fetch posts for the current tab to ensure pagination is correct
            toast.success('Post deleted successfully!');
            handleCloseModal();
            fetchPosts(currentPage, activeTab); // Re-fetch for current page and tab
        } catch (err) {
            console.error('Delete failed:', err);
            toast.error(err.message || 'Failed to delete post. Please try again.');
            setIsDeleting(false);
        }
    };

    if (loading && posts.length === 0) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error && posts.length === 0) {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center text-center p-4">
                <ServerCrash className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">An Error Occurred</h2>
                <p className="text-gray-600 mt-2">{error}</p>
                <button onClick={() => fetchPosts(1, activeTab)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Retry</button>
            </div>
        );
    }

    // Determine heading based on active tab
    const headingText = activeTab === 'my-posts' ? 'My Posts' : 'All Latest Posts';

    return (
        <div className="flex-1 p-4 md:p-8 bg-gray-100">
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Delete"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                isLoading={isDeleting}
            />

            <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{headingText}</h1>

                {/* Tabs for Dashboard Views */}
                <div className="flex space-x-4 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('all-posts')}
                        className={`py-2 px-4 text-lg font-medium ${activeTab === 'all-posts' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <LayoutGrid className="inline-block w-5 h-5 mr-2" /> All Posts
                    </button>
                    {isAuthenticated && ( // Only show "My Posts" if authenticated
                        <button
                            onClick={() => setActiveTab('my-posts')}
                            className={`py-2 px-4 text-lg font-medium ${activeTab === 'my-posts' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <User className="inline-block w-5 h-5 mr-2" /> My Posts
                        </button>
                    )}
                    {/* Placeholder for "My Comments" or "User Profile" tabs later */}
                </div>
            </div>

            {error && posts.length > 0 && (
                <div className="mb-4 text-center text-red-600">{error}</div>
            )}

            {posts.length === 0 && !loading ? (
                <div className="text-center py-16">
                    <FileText className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-700">
                        {activeTab === 'my-posts' ? "You haven't published any posts yet." : "No posts have been published yet."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {posts.map(post => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onPostUpdate={handlePostUpdate}
                                onDeleteClick={handleDeleteClick}
                                currentUser={user}
                                // Pass `showActions` prop to PostCard if you want to conditionally show edit/delete
                                showActions={activeTab === 'my-posts' || (user && user.role === 'admin')}
                            />
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;