import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Simplified Footer Content */}
                <div className="md:flex md:items-center md:justify-between">
                     {/* Column 1: Logo and Description */}
                    <div className="flex justify-center md:order-1 space-y-4 md:space-y-0">
                        <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-900">
                            <div className="p-1.5 bg-indigo-600 rounded-lg">
                                <Rocket className="w-5 h-5 text-white" />
                            </div>
                            <span>Quickblog</span>
                        </Link>
                    </div>
                    <div className="mt-8 md:mt-0 md:order-2 text-center md:text-left text-sm text-gray-500 max-w-xs mx-auto md:mx-0">
                         Your space to think out loud, to share what matters, and to write without filters.
                    </div>
                </div>

                 {/* REMOVED: Grid with Quick Links, Need Help, Follow Us */}

                {/* Bottom Copyright */}
                <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                    <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Quickblog. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;