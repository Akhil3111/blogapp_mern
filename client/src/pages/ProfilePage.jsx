import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, ServerCrash, Mail, User as UserIcon } from 'lucide-react';
import { getUserProfile } from '../services/authService';
import { deleteBlog } from '../services/blogService';
import PostCard from '../components/PostCard';
import ConfirmationModal from '../components/common/ConfirmationModal';
import PaginationControls from '../components/common/PaginationControls';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    // profileData holds { user: {...}, posts: { data: [], currentPage: ..., totalPages: ..., totalPosts: ...} }
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Delete modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchProfile = useCallback(async (pageToFetch = 1) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUserProfile(pageToFetch);
            // backend returns { success: true, user, posts: { data, currentPage, totalPages, totalPosts } }
            setProfileData(data);
            setCurrentPage(data?.posts?.currentPage || pageToFetch);
        } catch (err) {
            console.error('fetchProfile error:', err);
            setError('Could not load your profile. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile(currentPage);
    }, [currentPage, fetchProfile]);

    // Update a post inside profileData.posts.data
    const handlePostUpdate = useCallback((updatedPost) => {
        setProfileData(current => {
            if (!current?.posts?.data) return current;
            return {
                ...current,
                posts: {
                    ...current.posts,
                    data: current.posts.data.map(p => p._id === updatedPost._id ? updatedPost : p)
                }
            };
        });
    }, []);

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
            // Re-fetch current page to keep counts/pagination accurate
            await fetchProfile(currentPage);
            handleCloseModal();
        } catch (err) {
            console.error('Failed to delete post:', err);
            setError('Failed to delete the post. Please try again.');
            setIsDeleting(false);
        }
    };

    if (loading && !profileData) return <LoadingSpinner />; // show full loader only if no data yet
    if (error && !profileData) return <ErrorDisplay error={error} onRetry={() => fetchProfile(1)} />;
    if (!profileData || !profileData.user) return <ErrorDisplay error="Profile data could not be loaded." onRetry={() => navigate('/dashboard')} />;

    const { user, posts: postData } = profileData;

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

            <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-2xl font-bold">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">{user.username}</h1>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" /> {user.email}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Posts ({postData?.totalPosts || 0})</h2>

                {error && profileData?.user && (
                    <div className="mb-4 text-center text-red-600">{error}</div>
                )}

                {loading && profileData?.user && (
                    <div className="w-full flex justify-center py-4">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                )}

                {!loading && postData?.data?.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg p-8 bg-white">
                        <UserIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-gray-700">You haven't published any posts yet.</p>
                    </div>
                ) : (
                    postData?.data && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {postData.data.map(post => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        onPostUpdate={handlePostUpdate}
                                        onDeleteClick={handleDeleteClick}
                                        currentUser={currentUser}
                                    />
                                ))}
                            </div>

                            <div className="mt-8 flex justify-center">
                                <PaginationControls
                                    currentPage={postData.currentPage || currentPage}
                                    totalPages={postData.totalPages || 1}
                                    onPageChange={(page) => setCurrentPage(page)}
                                />
                            </div>
                        </>
                    )
                )}
            </div>
        </div>
    );
};

// Helper components
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
        {onRetry && <button onClick={onRetry} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Retry</button>}
    </div>
);

export default ProfilePage;