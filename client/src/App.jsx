import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from './hooks/useAuth';

// Import Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import MyBlogs from './pages/MyBlogs';

const AppLayout = () => {
    const { user, logout } = useAuth();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsMobileSidebarOpen(prev => !prev);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 antialiased font-sans">
            <Navbar 
                user={user} 
                isAuthenticated={true} 
                logout={logout} 
                toggleSidebar={toggleSidebar} 
            />
            <div className="flex flex-1 pt-20">
                <Sidebar 
                    isMobileOpen={isMobileSidebarOpen}
                    toggleSidebar={toggleSidebar}
                />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

function App() {
    const { isLoading } = useAuth();
    
    if (isLoading) {
        return (
           <div className="min-h-screen flex justify-center items-center bg-gray-100">
               <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
           </div>
       );
    }

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/my-blogs" element={<MyBlogs />} />
                    </Route>
                </Route>

                {/* Redirect root path to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                
                {/* Fallback for non-matching routes */}
                <Route path="*" element={
                    <div className="flex justify-center items-center min-h-screen">
                        <h1 className="text-2xl font-bold text-gray-800">404 Not Found</h1>
                    </div>
                } />
            </Routes>
        </Router>
    );
}

export default App;