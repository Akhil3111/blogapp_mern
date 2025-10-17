import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Rocket } from 'lucide-react';

const LandingNavbar = () => {
    const navigate = useNavigate();

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

                    {/* Dashboard Button */}
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                    </button>
                </div>
            </div>
        </header>
    );
};

export default LandingNavbar;