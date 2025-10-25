// client/src/components/common/CommentCard.jsx

import React from 'react';
import { Trash2, User as UserIcon } from 'lucide-react';

const CommentCard = ({ comment, currentUser, onDeleteClick }) => {
    // Function to format date (you might have this in a utility or use a library like moment/date-fns)
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Check if the current user is the author of the comment or an admin
    const canDelete = currentUser && (currentUser._id === comment.author?._id || currentUser.role === 'admin');

    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-2 text-gray-500" />
                    <p className="text-sm font-semibold text-gray-800">{comment.author?.username || 'Anonymous'}</p>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 text-xs">
                    <span>{formatDate(comment.createdAt)}</span>
                    {canDelete && (
                        <button
                            onClick={onDeleteClick}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                            aria-label="Delete comment"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
            <p className="text-gray-700 text-md break-words">{comment.content}</p>
        </div>
    );
};

export default CommentCard;