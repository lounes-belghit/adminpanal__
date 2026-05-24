import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'super_admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { user, loading, isAdmin, isSuperAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // Replace with a proper loader later
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole === 'super_admin' && !isSuperAdmin()) {
        return <Navigate to="/access-denied" replace />;
    }

    if (!isAdmin()) {
        return <Navigate to="/access-denied" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
