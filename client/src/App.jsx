import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

// --- Import Pages ---
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import MyBlogs from './pages/MyBlogs';
import AddBlogPage from './pages/AddBlogPage';
import BlogDetailsPage from './pages/BlogDetailsPage';
import EditBlogPage from './pages/EditBlogPage'; // Add this import

// --- Import Components ---
import AppNavbar from './components/AppNavbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// --- App Layout for Authenticated Users (with corrected Navbar prop) ---
const AppLayout = () => {
    // FIX #1: Get the real isAuthenticated status from the hook
    const { user, logout, isAuthenticated } = useAuth();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsMobileSidebarOpen(prev => !prev);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            {/* Pass the dynamic isAuthenticated value to the navbar */}
            <AppNavbar user={user} isAuthenticated={isAuthenticated} logout={logout} toggleSidebar={toggleSidebar} />
            <div className="flex flex-1 pt-16">
                <Sidebar isMobileOpen={isMobileSidebarOpen} toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

// --- Main App Router ---
function App() {
    const { isLoading } = useAuth();
    
    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center">
            <Loader2 className="w-16 h-16 animate-spin text-gray-400" />
        </div>;
    }

    return (
        <Router>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* --- Protected Routes (users must be logged in) --- */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/my-blogs" element={<MyBlogs />} />
                        <Route path="/add-blog" element={<AddBlogPage />} />
                        <Route path="/post/:id" element={<BlogDetailsPage />} />
                        <Route path="/edit-post/:id" element={<EditBlogPage />} />
                    </Route>
                </Route>
                
                {/* --- Fallback Route --- */}
                <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-800">404 Page Not Found</h1>
                    </div>
                } />
            </Routes>
        </Router>
    );
}

export default App;