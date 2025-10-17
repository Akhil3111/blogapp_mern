import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ServerCrash, FileText } from 'lucide-react';
import { getMyBlogs } from '../services/blogService';
import PostCard from '../components/PostCard';
import { useAuth } from '../hooks/useAuth';

const MyBlogs = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth(); // Get current user for PostCard

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                setLoading(true);
                const fetchedPosts = await getMyBlogs();
                setPosts(fetchedPosts);
            } catch (err) {
                setError('Could not load your posts. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, []);

    // Loading state with w-full h-full
    if (loading) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    // Error state with w-full h-full
    if (error) {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center text-center p-4">
                <ServerCrash className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">An Error Occurred</h2>
                <p className="text-gray-600 mt-2">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 md:p-8 bg-gray-100">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-3">
                My Blog Posts
            </h1>
            
            {posts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-indigo-200/50 max-w-2xl mx-auto">
                    <FileText className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-700 mb-6">You haven't written anything yet!</p>
                    <Link
                        to="/add-blog"
                        className="mt-4 px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                    >
                        Start Writing Your First Blog
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {posts.map(post => (
                        <PostCard 
                            key={post._id} 
                            post={post} 
                            currentUser={user}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBlogs;