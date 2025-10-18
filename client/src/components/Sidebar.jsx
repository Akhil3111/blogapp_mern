import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Plus, X, Home } from 'lucide-react'; // 1. Import Home icon

const Sidebar = ({ isMobileOpen, toggleSidebar }) => {
    const items = [
        // 2. Add the "Home" link pointing to the root "/"
        { name: 'Home', path: '/', icon: Home }, 
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My Blogs', path: '/my-blogs', icon: FileText },
        { name: 'Add Blog', path: '/add-blog', icon: Plus },
    ];

    const navLinkClasses = ({ isActive }) =>
        `flex items-center w-full my-1 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
            isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`;

    return (
        <>
            {isMobileOpen && <div className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden" onClick={toggleSidebar}></div>}
            <aside className={`fixed inset-y-0 left-0 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 w-64 bg-white text-gray-900 border-r border-gray-200 h-full p-4 transition-transform duration-300 ease-in-out z-40 pt-16 lg:pt-0`}>
                <button onClick={toggleSidebar} className="absolute top-2 right-2 text-gray-500 lg:hidden p-2">
                    <X className="w-6 h-6" />
                </button>
                <nav className="pt-8">
                    {items.map((item) => (
                        <NavLink key={item.name} to={item.path} end={item.path === '/'} onClick={isMobileOpen ? toggleSidebar : undefined} className={navLinkClasses}>
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;