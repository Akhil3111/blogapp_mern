import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Edit, Trash2, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { likePost, dislikePost } from '../services/blogService';

const PostCard = ({ post, onPostUpdate, onDeleteClick }) => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const isAuthor = user && post.author && user._id === post.author._id;
    const hasLiked = post.likes.includes(user?._id);
    const hasDisliked = post.dislikes.includes(user?._id);

    const handleLike = async () => {
        if (!isAuthenticated) return alert("Please log in to interact with posts.");
        try {
            const updatedPost = await likePost(post._id);
            onPostUpdate(updatedPost.data);
        } catch (error) {
            console.error("Failed to like post:", error);
        }
    };

    const handleDislike = async () => {
        if (!isAuthenticated) return alert("Please log in to interact with posts.");
        try {
            const updatedPost = await dislikePost(post._id);
            onPostUpdate(updatedPost.data);
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
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{post.author?.username || 'Unknown'}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button onClick={handleLike} className={`flex items-center space-x-1 text-sm ${hasLiked ? 'text-indigo-600' : 'text-gray-500'} hover:text-indigo-600 transition-colors`}>
                            <ThumbsUp className="w-4 h-4" />
                            <span>{post.likes.length}</span>
                        </button>

                        {/* --- NEW DISLIKE BUTTON --- */}
                        <button onClick={handleDislike} className={`flex items-center space-x-1 text-sm ${hasDisliked ? 'text-red-600' : 'text-gray-500'} hover:text-red-600 transition-colors`}>
                            <ThumbsDown className="w-4 h-4" />
                            <span>{post.dislikes.length}</span>
                        </button>
                        
                        <Link to={`/post/${post._id}#comments`} className="flex items-center space-x-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments?.length || 0}</span>
                        </Link>
                        
                        {isAuthor && (
                            <>
                                <button onClick={() => navigate(`/edit-post/${post._id}`)} className="text-gray-500 hover:text-blue-600 transition-colors">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => onDeleteClick(post._id)} className="text-gray-500 hover:text-red-600 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;