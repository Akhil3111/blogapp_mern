import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, ServerCrash, FileText } from 'lucide-react';
import { getAllBlogs, deleteBlog } from '../services/blogService';
import PostCard from '../components/PostCard';
import ConfirmationModal from '../components/common/ConfirmationModal';
import PaginationControls from '../components/common/PaginationControls';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Delete modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handlePostUpdate = useCallback((updatedPost) => {
        setPosts((prev) => prev.map(p => (p._id === updatedPost._id ? updatedPost : p)));
    }, []);

    const fetchPosts = useCallback(async (pageToFetch = 1) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllBlogs(pageToFetch);
            setPosts(data.posts || []);
            setCurrentPage(data.currentPage || pageToFetch);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('fetchPosts error:', err);
            setError('Could not load the feed. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage, fetchPosts]);

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
            setPosts(prev => prev.filter(p => p._id !== postToDelete));
            handleCloseModal();
        } catch (err) {
            console.error('Delete failed:', err);
            setError('Failed to delete post. Please try again.');
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
                <button onClick={() => fetchPosts(1)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Retry</button>
            </div>
        );
    }

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

            <div className="border-b border-gray-200 pb-4 mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-extrabold text-gray-900">Latest Posts</h1>
            </div>

            {error && posts.length > 0 && (
                <div className="mb-4 text-center text-red-600">{error}</div>
            )}

            {posts.length === 0 && !loading ? (
                <div className="text-center py-16">
                    <FileText className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-700">No posts have been published yet.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {posts.map(post => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onPostUpdate={handlePostUpdate}
                                onDeleteClick={handleDeleteClick} // always pass handler; PostCard decides visibility
                                currentUser={user}
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