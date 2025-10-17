import React, { useState, useEffect } from 'react';
import { Loader2, ServerCrash } from 'lucide-react';
import { getAllBlogs } from '../services/blogService';
import PostCard from '../components/PostCard';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth(); // Get current user to pass to PostCard

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const fetchedPosts = await getAllBlogs();
                setPosts(fetchedPosts);
            } catch (err) {
                setError('Could not load the feed. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        // Add w-full h-full to this div
        return (
            <div className="w-full h-full flex justify-center items-center">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        // Add w-full h-full to this div as well
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
                Latest Posts
            </h1>
            
            {posts.length === 0 ? (
                 <div className="text-center py-16">
                    <p className="text-xl font-semibold text-gray-700">No posts have been published yet.</p>
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

export default Dashboard;