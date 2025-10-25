// client/src/components/PostCard.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Edit, Trash2, ThumbsUp, ThumbsDown, MessageCircle, CalendarDays } from 'lucide-react'; // Added CalendarDays
// Removed useAuth import as currentUser is passed down
import { likePost, dislikePost } from '../services/blogService';
import { toast } from 'react-toastify'; // Added toast for better feedback

// Destructure currentUser from props, and removed the redundant showActions prop
const PostCard = ({ post, onPostUpdate, onDeleteClick, currentUser }) => {
    const navigate = useNavigate();

    // Determine user roles and states based on the PASSED currentUser prop
    const isAuthor = currentUser && post.author && currentUser._id === post.author._id;
    const isAdmin = currentUser && currentUser.role === 'admin';
    
    // Check if post.likes/dislikes are arrays before calling .includes
    const hasLiked = currentUser && Array.isArray(post.likes) && post.likes.includes(currentUser._id);
    const hasDisliked = currentUser && Array.isArray(post.dislikes) && post.dislikes.includes(currentUser._id);

    // --- Button visibility logic ---
    // Edit button: Visible if the current user is the author.
    const showEditButton = isAuthor;
    // Delete button: Visible if the parent passed the function AND (user is author OR user is admin).
    // The onDeleteClick prop should only be passed if delete is possible from the parent's context
    const showDeleteButton = onDeleteClick && (isAuthor || isAdmin);

    // Helper to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // --- Handlers ---
    const handleLike = async (e) => {
        e.stopPropagation(); // Prevent navigating to post details
        if (!currentUser) {
            toast.info("Please log in to like posts.");
            return;
        }
        try {
            const updatedPost = await likePost(post._id);
            onPostUpdate(updatedPost); // onPostUpdate expects the full updated post
            toast.success(hasLiked ? "Unliked post" : "Liked post");
        } catch (error) {
            console.error("Failed to like post:", error);
            toast.error(error.message || "Failed to like post.");
        }
    };

    const handleDislike = async (e) => {
        e.stopPropagation(); // Prevent navigating to post details
        if (!currentUser) {
            toast.info("Please log in to dislike posts.");
            return;
        }
        try {
            const updatedPost = await dislikePost(post._id);
            onPostUpdate(updatedPost); // onPostUpdate expects the full updated post
            toast.success(hasDisliked ? "Removed dislike" : "Disliked post");
        } catch (error) {
            console.error("Failed to dislike post:", error);
            toast.error(error.message || "Failed to dislike post.");
        }
    };

    const handleDeleteClickInternal = (e) => {
        e.stopPropagation(); // Prevent navigating to post details
        if (onDeleteClick) {
            onDeleteClick(post._id);
        }
    };

    const handleEditClickInternal = (e) => {
        e.stopPropagation(); // Prevent navigating to post details
        navigate(`/edit-post/${post._id}`);
    };


    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col">
            <Link to={`/post/${post._id}`} className="block h-48 overflow-hidden relative group">
                <img
                    src={post.thumbnail || "https://images.unsplash.com/photo-1517048676732-d65bc937f952"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </Link>

            <div className="p-5 flex flex-col flex-grow">
                <p className="text-sm font-semibold text-indigo-600 mb-2">{post.category}</p>
                <Link to={`/post/${post._id}`}>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors">
                        {post.title}
                    </h3>
                </Link>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3 flex-grow">
                    {post.subtitle || (post.content ? post.content.substring(0, 100) + '...' : 'No content preview available.')}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    {/* Author Info */}
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{post.author?.username || 'Unknown'}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <CalendarDays className="w-4 h-4" />
                        <span>{formatDate(post.createdAt)}</span>
                    </div>
                </div>

                {/* Engagement Metrics & Actions Row */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Like */}
                        <button onClick={handleLike} className={`flex items-center space-x-1 text-sm ${hasLiked ? 'text-indigo-600' : 'text-gray-500'} hover:text-indigo-600`}>
                            <ThumbsUp className="w-4 h-4" /> <span>{post.likes?.length || 0}</span>
                        </button>
                        {/* Dislike */}
                        <button onClick={handleDislike} className={`flex items-center space-x-1 text-sm ${hasDisliked ? 'text-red-600' : 'text-gray-500'} hover:text-red-600`}>
                            <ThumbsDown className="w-4 h-4" /> <span>{post.dislikes?.length || 0}</span>
                        </button>
                        {/* Comments Count */}
                        <Link to={`/post/${post._id}#comments`} className="flex items-center space-x-1 text-sm text-gray-500 hover:text-indigo-600">
                            <MessageCircle className="w-4 h-4" /> <span>{post.comments?.length || 0}</span>
                        </Link>
                    </div>

                    {/* Conditional Rendering for Edit/Delete buttons (moved to end for consistent layout) */}
                    {(showEditButton || showDeleteButton) && ( // Only show this div if any action button is visible
                        <div className="flex items-center space-x-2">
                            {showEditButton && (
                                <button
                                    onClick={handleEditClickInternal}
                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                    aria-label="Edit post"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                            )}
                            {showDeleteButton && (
                                <button
                                    onClick={handleDeleteClickInternal}
                                    className="text-gray-500 hover:text-red-600 transition-colors"
                                    aria-label="Delete post"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Define default props to prevent errors if props aren't passed
PostCard.defaultProps = {
    onPostUpdate: () => {}, // Provide a no-op function as default
    onDeleteClick: null,    // Default to null if not needed
    currentUser: null,      // Default current user to null
};

export default PostCard;