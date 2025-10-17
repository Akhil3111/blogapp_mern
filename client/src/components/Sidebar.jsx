import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Plus, X } from 'lucide-react';

const Sidebar = ({ isMobileOpen, toggleSidebar }) => {
    const items = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My Blogs', path: '/my-blogs', icon: FileText },
        { name: 'Add Blog', path: '/add-blog', icon: Plus },
    ];

    const navLinkClasses = ({ isActive }) =>
        `flex items-center w-full my-2 px-4 py-3 text-base font-medium rounded-xl transition duration-300 ease-in-out transform hover:scale-[1.02] ${
            isActive
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-purple-500/30'
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
        }`;

    return (
        <>
            {isMobileOpen && <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-30 lg:hidden" onClick={toggleSidebar}></div>}
            <aside className={`fixed inset-y-0 left-0 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 w-64 bg-gray-900/90 backdrop-blur-sm text-white shadow-2xl h-full p-6 space-y-4 border-r border-indigo-900 transition-transform duration-300 ease-in-out z-40`}>
                <button onClick={toggleSidebar} className="absolute top-4 right-4 text-gray-400 hover:text-white lg:hidden p-2 rounded-lg hover:bg-gray-700">
                    <X className="w-6 h-6" />
                </button>
                <nav className="pt-8">
                    {items.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={isMobileOpen ? toggleSidebar : undefined}
                            className={navLinkClasses}
                        >
                            <item.icon className="w-5 h-5 mr-4" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;