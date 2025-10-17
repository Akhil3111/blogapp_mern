import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const AddCommentForm = ({ postId, onCommentAdded }) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="p-4 text-center bg-gray-50 rounded-lg border">
                <p className="text-gray-600">You must be logged in to post a comment.</p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setError('');
        try {
            await onCommentAdded(postId, { content: text });
            setText('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                    {user?.username?.[0].toUpperCase() || 'A'}
                </div>
                <div className="flex-1">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)} // Corrected this line
                        placeholder="Join the discussion..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    ></textarea>
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 flex justify-center items-center py-2 px-4 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        Post Comment
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddCommentForm;