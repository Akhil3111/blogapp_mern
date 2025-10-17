import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // While the auth status is loading, don't render anything yet
    if (isLoading) {
        return null; // Or a loading spinner
    }

    // If the user is authenticated, render the child route's content.
    // The <Outlet /> component from react-router-dom does this.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;