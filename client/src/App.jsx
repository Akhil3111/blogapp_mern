import React, { useState } from 'react';
// FIX: Add Link to this import
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, Link } from 'react-router-dom';
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
import EditBlogPage from './pages/EditBlogPage';
import ProfilePage from './pages/ProfilePage';
import AboutUsPage from './pages/AboutUsPage';

// --- Import Components ---
import AppNavbar from './components/AppNavbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// --- App Layout for Authenticated Users ---
const AppLayout = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsMobileSidebarOpen(prev => !prev);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
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
    const { isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <Loader2 className="w-16 h-16 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
                <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
                <Route path="/about" element={<AboutUsPage />} />

                {/* --- Protected Routes --- */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/my-blogs" element={<MyBlogs />} />
                        <Route path="/add-blog" element={<AddBlogPage />} />
                        <Route path="/post/:id" element={<BlogDetailsPage />} />
                        <Route path="/edit-post/:id" element={<EditBlogPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>
                </Route>

                {/* --- Fallback Route (404) --- */}
                {/* Line 80 where the Link component is used */}
                <Route path="*" element={
                    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                        <p className="text-xl text-gray-600 mb-6">Oops! Page Not Found.</p>
                        {/* Ensure Link is imported to use it here */}
                        <Link to="/" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            Go Home
                        </Link>
                    </div>
                } />
            </Routes>
        </Router>
    );
}

export default App;