import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogById, deleteBlog, likePost, dislikePost } from '../services/blogService';
import { addCommentToPost, getCommentsForPost, deleteComment } from '../services/commentService'; // CORRECTED IMPORT NAMES
import { useAuth } from '../hooks/useAuth';
import { Loader2, ThumbsUp, ThumbsDown, MessageSquare, Edit, Trash2, CalendarDays, User as UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import ConfirmationModal from '../components/common/ConfirmationModal';
// CORRECTED IMPORTS based on your file structure:
import CommentForm from '../components/common/CommentForm'; // Assuming you renamed AddCommentForm to CommentForm and it's in common
import CommentCard from '../components/common/CommentCard'; // New component created and it's in common


const BlogDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentLoading, setCommentLoading] = useState(true);
    const [commentError, setCommentError] = useState(null);

    // Like/Dislike state
    const [userLiked, setUserLiked] = useState(false);
    const [userDisliked, setUserDisliked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [dislikesCount, setDislikesCount] = useState(0);

    // Delete Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); // 'post' or 'commentId'
    const [isDeleting, setIsDeleting] = useState(false);

    // Function to format date (unchanged)
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // --- Fetch Post Details ---
    const fetchPostDetails = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getBlogById(id);
            setPost(data);
            setLikesCount(data.likes.length);
            setDislikesCount(data.dislikes.length);
            if (user) {
                setUserLiked(data.likes.includes(user._id));
                setUserDisliked(data.dislikes.includes(user._id));
            }
            setError(null);
        } catch (err) {
            console.error("Error fetching post:", err);
            setError('Could not load blog post.');
            toast.error('Failed to load blog post.');
            // Assuming /dashboard is the fallback if post cannot be loaded
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    }, [id, user, navigate]);

    // --- Fetch Comments ---
    const fetchComments = useCallback(async () => {
        try {
            setCommentLoading(true);
            // Changed getCommentsByPostId to getCommentsForPost
            const fetchedComments = await getCommentsForPost(id); // <--- UPDATED FUNCTION CALL
            // Sort comments by creation date, newest first
            setComments(fetchedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            setCommentError(null);
        } catch (err) {
            console.error("Error fetching comments:", err);
            setCommentError('Could not load comments.');
        } finally {
            setCommentLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPostDetails();
        fetchComments();
    }, [fetchPostDetails, fetchComments]);

    // --- Handle Like/Dislike ---
    const handleLike = async () => { /* ... (Your existing handleLike logic) ... */
        if (!isAuthenticated) {
            toast.info("Please log in to like posts.");
            return;
        }
        try {
            const res = await likePost(id);
            setLikesCount(res.likes.length);
            setDislikesCount(res.dislikes.length);
            setUserLiked(res.likes.includes(user._id));
            setUserDisliked(res.dislikes.includes(user._id));
            toast.success(userLiked ? "Unliked post" : "Liked post");
        } catch (err) {
            console.error("Error liking post:", err);
            toast.error(err.message || "Failed to like post.");
        }
    };

    const handleDislike = async () => { /* ... (Your existing handleDislike logic) ... */
        if (!isAuthenticated) {
            toast.info("Please log in to dislike posts.");
            return;
        }
        try {
            const res = await dislikePost(id);
            setLikesCount(res.likes.length);
            setDislikesCount(res.dislikes.length);
            setUserLiked(res.likes.includes(user._id));
            setUserDisliked(res.dislikes.includes(user._id));
            toast.success(userDisliked ? "Removed dislike" : "Disliked post");
        } catch (err) {
            console.error("Error disliking post:", err);
            toast.error(err.message || "Failed to dislike post.");
        }
    };

    // --- Handle Comment Submission ---
    const handleCommentSubmit = async (commentText) => {
        if (!isAuthenticated) {
            toast.info("Please log in to comment.");
            return;
        }
        if (!commentText.trim()) {
            toast.error("Comment cannot be empty.");
            return;
        }
        try {
            // Changed createComment to addCommentToPost
            await addCommentToPost(id, { content: commentText }); // <--- UPDATED FUNCTION CALL
            toast.success('Comment added successfully!');
            fetchComments(); // Refresh comments
        } catch (err) {
            console.error("Error adding comment:", err);
            toast.error(err.message || 'Failed to add comment.');
        }
    };

    // --- Handle Delete Confirmation (Post or Comment) ---
    const handleDeleteClick = (type, itemId = null) => {
        setItemToDelete({ type, id: itemId });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setItemToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            if (itemToDelete.type === 'post') {
                await deleteBlog(post._id);
                toast.success('Post deleted successfully!');
                navigate('/my-blogs');
            } else if (itemToDelete.type === 'comment') {
                // deleteComment matches, so no change needed here
                await deleteComment(itemToDelete.id);
                toast.success('Comment deleted successfully!');
                fetchComments(); // Refresh comments
            }
        } catch (err) {
            console.error("Error deleting item:", err);
            toast.error(err.message || `Failed to delete ${itemToDelete.type}.`);
        } finally {
            setIsDeleting(false);
            handleCloseModal();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[500px]">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 text-lg">{error}</p>
                <button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">
                    Go to Dashboard
                </button>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center py-10 text-gray-600">
                No post found. It might have been deleted or never existed.
                <button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg">
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title={`Delete ${itemToDelete?.type === 'post' ? 'Post' : 'Comment'}`}
                message={`Are you sure you want to delete this ${itemToDelete?.type}? This action cannot be undone.`}
                confirmText={isDeleting ? 'Deleting...' : 'Delete'}
                isConfirming={isDeleting}
            />

            {/* Post Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-3">{post.title}</h1>
                <p className="text-xl text-gray-600 mb-5">{post.subtitle}</p>
                <div className="flex items-center text-gray-500 text-sm">
                    {/* Author & Date */}
                    <div className="flex items-center mr-4">
                        <UserIcon className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="font-medium text-gray-700">{post.author?.username || 'Unknown Author'}</span>
                    </div>
                    <div className="flex items-center mr-4">
                        <CalendarDays className="w-4 h-4 mr-1 text-gray-400" />
                        <span>{formatDate(post.createdAt)}</span>
                    </div>
                    {/* Category */}
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">
                        {post.category}
                    </span>
                </div>
            </div>

            {/* Post Thumbnail (if exists) */}
            {post.thumbnail && (
                <div className="mb-8">
                    <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-md"
                    />
                </div>
            )}

            {/* Post Content - DANGER: Using dangerouslySetInnerHTML */}
            <div className="prose prose-indigo max-w-none mb-10 text-gray-800"
                 dangerouslySetInnerHTML={{ __html: post.content }}>
            </div>

            {/* Like/Dislike & Comment Actions */}
            <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-8">
                <div className="flex space-x-6">
                    {/* Likes */}
                    <button
                        onClick={handleLike}
                        className={`flex items-center text-sm font-medium ${userLiked ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-700`}
                        disabled={!isAuthenticated}
                        aria-label="Like post"
                    >
                        <ThumbsUp className={`w-5 h-5 mr-1 ${userLiked ? 'fill-indigo-600' : 'text-gray-400'}`} />
                        {likesCount} Likes
                    </button>
                    {/* Dislikes */}
                    <button
                        onClick={handleDislike}
                        className={`flex items-center text-sm font-medium ${userDisliked ? 'text-red-600' : 'text-gray-600'} hover:text-red-700`}
                        disabled={!isAuthenticated}
                        aria-label="Dislike post"
                    >
                        <ThumbsDown className={`w-5 h-5 mr-1 ${userDisliked ? 'fill-red-600' : 'text-gray-400'}`} />
                        {dislikesCount} Dislikes
                    </button>
                    {/* Comments Count */}
                    <div className="flex items-center text-gray-600 text-sm font-medium">
                        <MessageSquare className="w-5 h-5 mr-1 text-gray-400" />
                        {comments.length} Comments
                    </div>
                </div>

                {/* Edit/Delete Buttons (only for author or admin) */}
                {(user?._id === post.author?._id || user?.role === 'admin') && (
                    <div className="flex space-x-4">
                        <Link
                            to={`/edit-post/${post._id}`}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Link>
                        <button
                            onClick={() => handleDeleteClick('post')}
                            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Comments Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
                {isAuthenticated && (
                    <CommentForm onSubmit={handleCommentSubmit} />
                )}

                {commentLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : commentError ? (
                    <p className="text-red-500 text-center py-8">{commentError}</p>
                ) : comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No comments yet. Be the first!</p>
                ) : (
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <CommentCard
                                key={comment._id}
                                comment={comment}
                                currentUser={user}
                                onDeleteClick={() => handleDeleteClick('comment', comment._id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogDetailsPage;