import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, LayoutDashboard, FileText, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; // 1. Import the useAuth hook

const LandingNavbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth(); // 2. Get the authentication state

    return (
        <header className="bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-30 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-900">
                        <div className="p-1.5 bg-indigo-600 rounded-lg">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <span>Quickblog</span>
                    </Link>

                    {/* 3. Conditionally render buttons based on auth state */}
                    {isAuthenticated ? (
                        // Show these buttons if the user IS logged in
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700 rounded-md hover:bg-gray-100"
                            >
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/my-blogs')}
                                className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700 rounded-md hover:bg-gray-100"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                My Blogs
                            </button>
                            <button
                                onClick={() => navigate('/add-blog')}
                                className="flex items-center px-3 py-2 text-sm font-semibold bg-gray-900 text-white rounded-md hover:bg-gray-800"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Blog
                            </button>
                        </div>
                    ) : (
                        // Show these buttons if the user IS NOT logged in
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-md hover:bg-gray-100"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="px-4 py-2 text-sm font-semibold bg-gray-900 text-white rounded-md hover:bg-gray-800"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default LandingNavbar;