import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, isAuthenticated, logout, toggleSidebar }) => {
    const navigate = useNavigate();

    return (
        <header className="bg-white/50 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-20 border-b border-white/20">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                <div className="flex items-center">
                    {isAuthenticated && (
                        <button onClick={toggleSidebar} className="text-gray-900 mr-3 lg:hidden p-2 rounded-lg hover:bg-gray-100 transition">
                            <Menu className="w-6 h-6" />
                        </button>
                    )}
                    <Link
                        to={isAuthenticated ? '/dashboard' : '/login'}
                        className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 tracking-wider transition transform hover:scale-105"
                    >
                        Quickblog
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    {isAuthenticated && user ? (
                        <>
                            <div className="flex items-center space-x-3 p-1 rounded-full bg-indigo-50/50 shadow-inner">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                    {user.username?.[0].toUpperCase() || 'U'}
                                </div>
                                <span className="text-base font-medium text-gray-700 hidden md:inline pr-2">
                                    {user.username}
                                </span>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center px-4 py-2 text-sm font-medium rounded-full shadow-lg text-white bg-red-500 hover:bg-red-600 transition transform hover:scale-105"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate('/login')} className="text-indigo-600 hover:text-purple-600 transition font-medium">
                                Login
                            </button>
                            <button onClick={() => navigate('/register')} className="px-5 py-2 text-sm font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105">
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;