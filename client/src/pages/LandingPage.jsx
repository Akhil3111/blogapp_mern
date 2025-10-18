import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Languages } from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';
import LandingPostCard from '../components/LandingPostCard';
import LoginModal from '../components/common/LoginModal';
import { getAllBlogs } from '../services/blogService';
import { useAuth } from '../hooks/useAuth';

// Text content for "How Quickblog Works"
const howItWorksEnglish = "Quickblog is your space to share thoughts, experiences, and daily life. Register easily, write your posts, and connect with others through comments and likes. It's a simple platform designed for authentic expression and community interaction.";
const howItWorksTelugu = "క్విక్‌బ్లాగ్ అనేది మీ ఆలోచనలు, అనుభవాలు మరియు రోజువారీ జీవితాన్ని పంచుకోవడానికి మీ స్థలం. సులభంగా నమోదు చేసుకోండి, మీ పోస్ట్‌లను వ్రాయండి మరియు వ్యాఖ్యలు మరియు ఇష్టాల ద్వారా ఇతరులతో కనెక్ట్ అవ్వండి. ఇది ప్రామాణికమైన వ్యక్తీకరణ మరియు సంఘం పరస్పర చర్య కోసం రూపొందించబడిన ఒక సాధారణ వేదిక.";

const LandingPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTelugu, setIsTelugu] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                // Fetch only the first 4 posts for the landing page
                const response = await getAllBlogs(1, 4); // Use page 1, limit 4
                
                // Extract the 'posts' array from the response object
                setPosts(response.posts || []); // Use response.posts

            } catch (err) {
                console.error("Failed to fetch posts:", err);
                setPosts([]); // Set to empty array on error
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []); // Empty dependency array means this runs only once on mount

    const handlePostClick = (postId) => {
        if (isAuthenticated) {
            navigate(`/post/${postId}`);
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <div className="bg-white">
            <LandingNavbar />
            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <main className="pt-16">
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
                    {loading ? (
                       <div className="flex justify-center">
                           <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                       </div>
                    ) : (
                        posts.length > 0 ? ( // Check if posts array has items
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {posts.map(post => (
                                    <LandingPostCard
                                        key={post._id}
                                        post={post}
                                        onClick={() => handlePostClick(post._id)}
                                    />
                                ))}
                            </div>
                        ) : ( // Display a message if no posts are found
                            <div className="text-center text-gray-500 py-10">No posts available yet.</div>
                        )
                    )}
                </section>

                {/* About & How It Works Section */}
                <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* About Me Column */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Me</h2>
                            <p className="text-gray-600 mb-4">
                                I’m Pallapu Akhil, a passionate and detail-oriented full-stack developer with a strong focus on building efficient, scalable, and user-friendly web applications.
                            </p>
                            <p className="text-gray-600">
                                I enjoy working across both frontend and backend technologies to bring creative ideas to life. This project showcases my skills in the MERN stack.
                            </p>
                            {/* Optional: Add links to portfolio/socials here */}
                        </div>

                        {/* How Quickblog Works Column */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Quickblog Works</h2>
                            <p className="text-gray-600 mb-4">
                                {isTelugu ? howItWorksTelugu : howItWorksEnglish}
                            </p>
                            <button
                                onClick={() => setIsTelugu(!isTelugu)}
                                className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                            >
                                <Languages className="w-4 h-4 mr-1" />
                                {isTelugu ? 'View in English' : 'తెలుగులో చూడండి'}
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;