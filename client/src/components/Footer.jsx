import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Logo and Description */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-900">
                            <div className="p-1.5 bg-indigo-600 rounded-lg">
                                <Rocket className="w-5 h-5 text-white" />
                            </div>
                            <span>Quickblog</span>
                        </Link>
                        <p className="text-gray-500 text-sm">
                            Your space to think out loud, to share what matters, and to write without filters.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Home</Link></li>
                            <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Best Sellers</Link></li>
                            <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Contact Us</Link></li>
                            <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Need Help? */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Need Help?</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Delivery Information</Link></li>
                            <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Return & Refund Policy</Link></li>
                            <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Payment Methods</Link></li>
                            <li><Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Track your Order</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Follow Us */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Follow Us</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Instagram</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Twitter</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Facebook</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">YouTube</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="mt-12 border-t border-gray-200 pt-8 text-center">
                    <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Quickblog. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;