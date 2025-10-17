import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, ServerCrash, FileText } from 'lucide-react';
import { getAllBlogs } from '../services/blogService';
import PostCard from '../components/PostCard';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Callback to update a single post in the state (e.g., after a like/dislike)
    // This prevents a full page refresh and provides a better user experience.
    const handlePostUpdate = useCallback((updatedPost) => {
        setPosts(currentPosts => 
            currentPosts.map(p => p._id === updatedPost._id ? updatedPost : p)
        );
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const fetchedPosts = await getAllBlogs();
                setPosts(fetchedPosts);
            } catch (err) {
                setError('Could not load the feed. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full flex justify-center items-center p-10">
                <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center text-center p-10">
                <ServerCrash className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">An Error Occurred</h2>
                <p className="text-gray-600 mt-2">{error}</p>
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-gray-600">Welcome back! Here are the latest posts from the community.</p>
            </div>
            
            {/* Content Area */}
            {posts.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">It's quiet in here...</h3>
                    <p className="text-gray-500 mt-2">No posts have been published yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {posts.map(post => (
                        <PostCard 
                            key={post._id} 
                            post={post} 
                            onPostUpdate={handlePostUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;