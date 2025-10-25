// client/src/components/common/CommentForm.jsx

import React, { useState } from 'react';
import { SendHorizonal } from 'lucide-react'; // Assuming you have lucide-react installed

const CommentForm = ({ onSubmit }) => {
    const [commentContent, setCommentContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (commentContent.trim()) {
            onSubmit(commentContent);
            setCommentContent(''); // Clear the input after submission
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
            <div className="mb-4">
                <label htmlFor="comment" className="block text-lg font-medium text-gray-800 mb-2">
                    Leave a Comment
                </label>
                <textarea
                    id="comment"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 placeholder-gray-400 shadow-sm transition-all duration-200 resize-y min-h-[80px]"
                    rows="3"
                    placeholder="Share your thoughts..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    required
                ></textarea>
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                    <SendHorizonal className="w-5 h-5 mr-2" />
                    Submit Comment
                </button>
            </div>
        </form>
    );
};

export default CommentForm; // <--- This line is critical for exporting the component