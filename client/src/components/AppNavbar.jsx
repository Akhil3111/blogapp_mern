import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';

const AppNavbar = ({ user, isAuthenticated, logout, toggleSidebar }) => {
    const navigate = useNavigate();

    const goToProfile = () => {
        navigate('/profile');
    };

    return (
        <header className="bg-white fixed top-0 left-0 right-0 z-20 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left: Mobile menu + Logo */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-600 lg:hidden p-2 rounded-md hover:bg-gray-100"
                            aria-label="Toggle sidebar"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-xl font-bold text-gray-900"
                            aria-label="Go to dashboard"
                        >
                            Quickblog
                        </button>
                    </div>

                    {/* Right: User info + Logout */}
                    {isAuthenticated && (
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={goToProfile}
                                className="flex items-center space-x-2 cursor-pointer group"
                                aria-label="View profile"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm group-hover:bg-gray-300 transition-colors">
                                    {user?.username?.[0]?.toUpperCase() || 'A'}
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:inline group-hover:text-gray-900 transition-colors">
                                    {user?.username}
                                </span>
                            </button>

                            <button
                                onClick={logout}
                                className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 hover:text-red-600 bg-gray-100 hover:bg-red-50 border border-gray-200 transition-all duration-200"
                                aria-label="Logout"
                            >
                                <LogOut className="w-4 h-4 md:mr-2" />
                                <span className="hidden md:inline">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AppNavbar;