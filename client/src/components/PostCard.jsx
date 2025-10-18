import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Edit, Trash2, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { likePost, dislikePost } from '../services/blogService';

const PostCard = ({ post, onPostUpdate, onDeleteClick }) => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Determine user roles and states
    const isAuthor = user && post.author && user._id === post.author._id;
    const isAdmin = user && user.role === 'admin';
    const hasLiked = post.likes.includes(user?._id);
    const hasDisliked = post.dislikes.includes(user?._id);

    // --- Button visibility logic ---
    // Edit button: Only visible to the author.
    const showEditButton = isAuthor;
    // Delete button: Visible if the parent passed the function AND (user is author OR user is admin).
    const showDeleteButton = typeof onDeleteClick === 'function' && (isAuthor || isAdmin);

    // --- Handlers (Keep these inside the component) ---
    const handleLike = async () => {
        if (!isAuthenticated) return alert("Please log in to interact with posts.");
        try {
            const updatedPost = await likePost(post._id);
            onPostUpdate(updatedPost.data); // Use the passed-in prop directly
        } catch (error) {
            console.error("Failed to like post:", error);
        }
    };

    const handleDislike = async () => {
        if (!isAuthenticated) return alert("Please log in to interact with posts.");
        try {
            const updatedPost = await dislikePost(post._id);
            onPostUpdate(updatedPost.data); // Use the passed-in prop directly
        } catch (error) {
            console.error("Failed to dislike post:", error);
        }
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
                    {post.subtitle || post.content.substring(0, 100) + '...'}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    {/* Author Info */}
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{post.author?.username || 'Unknown'}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Like/Dislike/Comment Buttons */}
                        <button onClick={handleLike} className={`flex items-center space-x-1 text-sm ${hasLiked ? 'text-indigo-600' : 'text-gray-500'} hover:text-indigo-600`}>
                            <ThumbsUp className="w-4 h-4" /> <span>{post.likes.length}</span>
                        </button>
                        <button onClick={handleDislike} className={`flex items-center space-x-1 text-sm ${hasDisliked ? 'text-red-600' : 'text-gray-500'} hover:text-red-600`}>
                            <ThumbsDown className="w-4 h-4" /> <span>{post.dislikes.length}</span>
                        </button>
                        <Link to={`/post/${post._id}#comments`} className="flex items-center space-x-1 text-sm text-gray-500 hover:text-indigo-600">
                            <MessageCircle className="w-4 h-4" /> <span>{post.comments?.length || 0}</span>
                        </Link>

                        {/* --- Conditional Rendering for Edit/Delete --- */}
                        {showEditButton && (
                            <button
                                onClick={() => navigate(`/edit-post/${post._id}`)}
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                aria-label="Edit post"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        )}
                        {showDeleteButton && (
                             <button
                                onClick={() => onDeleteClick(post._id)} // Directly use the prop
                                className="text-gray-500 hover:text-red-600 transition-colors"
                                aria-label="Delete post"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Define default props to prevent errors if props aren't passed
PostCard.defaultProps = {
    onPostUpdate: () => {}, // Provide a no-op function as default
    onDeleteClick: null,    // Default to null if not needed
};

export default PostCard;