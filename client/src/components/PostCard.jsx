import React from 'react';
import { User, ThumbsUp, ThumbsDown, Edit, Trash2 } from 'lucide-react';

// Placeholder for the PostActions component we will create later
const PostActions = ({ post }) => (
    <span className="flex items-center space-x-3 text-sm">
        <button className="flex items-center px-3 py-1.5 rounded-full text-gray-500 hover:text-green-600 bg-gray-50 transition">
            <ThumbsUp className="w-4 h-4 mr-1" /> {post.likes.length}
        </button>
        <button className="flex items-center px-3 py-1.5 rounded-full text-gray-500 hover:text-red-600 bg-gray-50 transition">
            <ThumbsDown className="w-4 h-4 mr-1" /> {post.dislikes.length}
        </button>
    </span>
);


const PostCard = ({ post, currentUser }) => {
    // Check if the currently logged-in user is the author of the post
    const isAuthor = currentUser && post.author && currentUser._id === post.author._id;
    const placeholderImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' style='background:%23ddd'%3E%3C/svg%3E";

    return (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out flex flex-col hover:shadow-2xl hover:shadow-indigo-300/50 transform hover:scale-[1.02]">
            <div className="h-48 overflow-hidden relative">
                <img 
                    src={post.thumbnail || placeholderImg} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                    onError={(e) => { e.target.onerror = null; e.target.src=placeholderImg; }}
                />
                 {/* AUTHOR-ONLY EDIT/DELETE BUTTONS */}
                 {isAuthor && (
                    <div className="absolute top-2 right-2 flex space-x-2">
                        <button 
                            // onClick={() => handleEdit(post._id)}
                            className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-110"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button 
                            // onClick={() => handleDelete(post._id)}
                            className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition transform hover:scale-110"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                 )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <span className="px-3 py-1 text-xs text-white rounded-full font-bold bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md shadow-purple-300/50 self-start">
                    {post.category}
                </span>
                
                <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow">{post.subtitle || post.content.substring(0, 100) + '...'}</p>
                
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="flex items-center space-x-1 text-gray-600 text-sm">
                        <User className="w-4 h-4" />
                        <span>{post.author?.username || 'Unknown'}</span>
                    </span>
                    <PostActions post={post} />
                </div>
            </div>
        </div>
    );
};

export default PostCard;