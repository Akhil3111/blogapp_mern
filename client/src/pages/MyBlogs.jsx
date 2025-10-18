import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ServerCrash, FileText, Plus } from 'lucide-react';
import { getMyBlogs, deleteBlog } from '../services/blogService';
import PostCard from '../components/PostCard';
import ConfirmationModal from '../components/common/ConfirmationModal';
import PaginationControls from '../components/common/PaginationControls';
import { useAuth } from '../hooks/useAuth';

const MyBlogs = () => {
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
        setPosts(prev => prev.map(p => (p._id === updatedPost._id ? updatedPost : p)));
    }, []);

    const fetchUserPosts = useCallback(async (pageToFetch = 1) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getMyBlogs(pageToFetch);
            setPosts(data.posts || []);
            setCurrentPage(data.currentPage || pageToFetch);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('fetchUserPosts error:', err);
            setError('Could not load your posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserPosts(currentPage);
    }, [currentPage, fetchUserPosts]);

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
            // If removing the last item on the page and not on first page, go back one page
            if (posts.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            } else {
                // refresh counts/pages from backend
                fetchUserPosts(currentPage);
            }
            handleCloseModal();
        } catch (err) {
            console.error('Failed to delete post:', err);
            setError('Failed to delete the post. Please try again.');
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
                <button onClick={() => fetchUserPosts(1)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Retry</button>
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

            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">My Blog Posts</h1>
                <Link to="/add-blog" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                    <Plus className="w-4 h-4" /> New Post
                </Link>
            </div>

            {error && posts.length > 0 && (
                <div className="mb-4 text-center text-red-600">{error}</div>
            )}

            {posts.length === 0 && !loading ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-indigo-200/50 max-w-2xl mx-auto">
                    <FileText className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-700 mb-6">You haven't written anything yet!</p>
                    <Link
                        to="/add-blog"
                        className="mt-4 px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                    >
                        Start Writing Your First Blog
                    </Link>
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

// Helper components (simple inline versions kept local)
const LoadingSpinner = () => (
    <div className="w-full h-full flex justify-center items-center p-10">
        <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
    </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
    <div className="w-full h-full flex flex-col justify-center items-center text-center p-10">
        <ServerCrash className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">An Error Occurred</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <button onClick={onRetry} className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Retry</button>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-16">
        <FileText className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <p className="text-xl font-semibold text-gray-700">No posts yet.</p>
        <Link to="/add-blog" className="mt-4 inline-block px-5 py-3 bg-indigo-600 text-white rounded-xl">Write your first post</Link>
    </div>
);

export default MyBlogs;