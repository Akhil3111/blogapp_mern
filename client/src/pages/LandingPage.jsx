// client/src/pages/LandingPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; // Removed Languages icon
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';
import LandingPostCard from '../components/LandingPostCard';
import LoginModal from '../components/common/LoginModal';
import { getAllBlogs } from '../services/blogService';
import { useAuth } from '../hooks/useAuth';

// Text content for "How Quickblog Works" - now only English
const howItWorksEnglish = "Quickblog is your space to share thoughts, experiences, and daily life. Register easily, write your posts, and connect with others through comments and likes. It's a simple platform designed for authentic expression and community interaction.";

const LandingPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Removed isTelugu state
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await getAllBlogs(1, 4);
                setPosts(response.posts || []);
            } catch (err) {
                console.error("Failed to fetch posts:", err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handlePostClick = (postId) => {
        if (isAuthenticated) {
            navigate(`/post/${postId}`);
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <div className="bg-white flex flex-col min-h-screen">
            <LandingNavbar />
            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <main className="flex-grow pt-16">
                {/* Hero Section */}
                <section className="relative text-center py-20 lg:py-32 px-4 bg-gray-50">
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50 to-white opacity-50"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
                            Your own blogging platform.
                        </h1>
                        <p className="mt-6 text-lg text-gray-600">
                            This is your space to think out loud, to share what matters, and to write without filters. Whether it's one word or a thousand, your story starts right here.
                        </p>
                    </div>
                </section>

                {/* Blog Post Grid */}
                <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Posts</h2>
                    {loading ? (
                       <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
                    ) : (
                        posts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {posts.map(post => (
                                    <LandingPostCard
                                        key={post._id}
                                        post={post}
                                        onClick={() => handlePostClick(post._id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-10">No posts available yet.</div>
                        )
                    )}
                </section>

                {/* How Quickblog Works Section - Now a standalone section */}
                <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">How Quickblog Works</h2>
                        <p className="text-gray-600 mb-4">
                            {howItWorksEnglish} {/* Directly use English content */}
                        </p>
                        {/* Removed the button for language toggle */}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;