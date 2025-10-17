import React from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/LandingNavbar';
import Footer from '../components/Footer';

// Dummy data for blog posts to populate the grid
const dummyPosts = [
    { id: 1, category: 'Lifestyle', title: 'A detailed step by step guide to manage your lifestyle', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070' },
    { id: 2, category: 'Startup', title: 'How to create an effective startup roadmap or ideas', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070' },
    { id: 3, category: 'Technology', title: 'Learning new technology to boost your career in software', image: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=2070' },
    { id: 4, category: 'Technology', title: 'Tips for getting the most out of apps and software', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070' }
];

// Reusable Post Card for the landing page
const PostCard = ({ post }) => (
    <div className="group">
        <div className="overflow-hidden rounded-lg">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="mt-4">
            <p className="text-sm font-semibold text-indigo-600">{post.category}</p>
            <h3 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
        </div>
    </div>
);

const LandingPage = () => {
    return (
        <div className="bg-white">
            <Navbar />
            
            <main className="pt-16">
                {/* Hero Section */}
                <section className="relative text-center py-20 lg:py-32 px-4 bg-gray-50">
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50 to-white opacity-50"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full mb-4">
                            New AI feature integrated ✨
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
                            Your own blogging platform.
                        </h1>
                        <p className="mt-6 text-lg text-gray-600">
                            This is your space to think out loud, to share what matters, and to write without filters. Whether it's one word or a thousand, your story starts right here.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
                            <div className="relative flex-grow w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for blogs"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>
                            <button className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700">
                                Search
                            </button>
                        </div>
                    </div>
                </section>

                {/* Blog Post Grid */}
                <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {dummyPosts.map(post => <PostCard key={post.id} post={post} />)}
                    </div>
                </section>

                {/* Subscription Section */}
                <section className="bg-gray-50 py-16">
                    <div className="max-w-xl mx-auto text-center px-4">
                        <h2 className="text-3xl font-bold text-gray-900">Never Miss a Blog!</h2>
                        <p className="mt-4 text-gray-600">
                            Subscribe to get the latest blog, new tech, and exclusive news.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email at"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <button className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700">
                                Subscribe
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