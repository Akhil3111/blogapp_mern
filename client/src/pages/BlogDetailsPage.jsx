import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogById } from '../services/blogService';
import { getCommentsForPost, addCommentToPost } from '../services/commentService';
import AddCommentForm from '../components/AddCommentForm';
import { Loader2, ServerCrash, User, Calendar, MessageCircle } from 'lucide-react';

const BlogDetailsPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch both the post and its comments
    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                setLoading(true);
                const [fetchedPost, fetchedComments] = await Promise.all([
                    getBlogById(id),
                    getCommentsForPost(id)
                ]);
                setPost(fetchedPost);
                setComments(fetchedComments);
            } catch (err) {
                setError('Could not load the post. It might not exist.');
            } finally {
                setLoading(false);
            }
        };
        fetchPostAndComments();
    }, [id]);

    // Callback function to handle adding a new comment
    const handleCommentAdded = useCallback(async (postId, commentData) => {
        const newComment = await addCommentToPost(postId, commentData);
        // Add the new comment to the top of the list for immediate UI update
        setComments(currentComments => [newComment, ...currentComments]);
    }, []);

    // ... (Loading and Error states are unchanged) ...
    if (loading) return <div className="w-full flex justify-center items-center p-10"><Loader2 className="w-12 h-12 animate-spin text-gray-400" /></div>;
    if (error) return ( <div className="w-full text-center p-10"><ServerCrash className="w-16 h-16 text-red-500 mx-auto mb-4" /><h2 className="text-2xl font-bold text-gray-800">An Error Occurred</h2><p className="text-gray-600 mt-2">{error}</p><Link to="/dashboard" className="mt-6 inline-block text-indigo-600 hover:underline">&larr; Back to Dashboard</Link></div>);
    if (!post) return null;

    return (
        <article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 border border-gray-200 rounded-lg shadow-sm">
            {/* ... (Post header, meta, and thumbnail are unchanged) ... */}
            <div className="text-center mb-6"><p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">{post.category}</p><h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">{post.title}</h1><p className="mt-4 text-lg text-gray-600">{post.subtitle}</p></div>
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200"><div className="flex items-center space-x-2"><User className="w-4 h-4" /><span>{post.author?.username || 'Unknown Author'}</span></div><div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div></div>
            <div className="mb-8"><img src={post.thumbnail} alt={post.title} className="w-full h-auto max-h-[400px] object-cover rounded-lg" /></div>
            <div className="prose prose-lg max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        
            {/* Comments Section */}
            <div id="comments" className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
                    <MessageCircle className="w-6 h-6 mr-3" />
                    Comments ({comments.length})
                </h2>
                
                {/* Add Comment Form */}
                <AddCommentForm postId={post._id} onCommentAdded={handleCommentAdded} />

                {/* List of Comments */}
                <div className="mt-8 space-y-6">
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment._id} className="flex items-start space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-600 font-bold">
                                    {comment.author?.username?.[0].toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 bg-gray-50 p-4 rounded-lg border">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-gray-900">{comment.author?.username || 'Anonymous'}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="text-gray-700 mt-2">{comment.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center bg-gray-50 rounded-lg border">
                            <p className="text-gray-600">Be the first to leave a comment!</p>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

export default BlogDetailsPage;