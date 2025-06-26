import React from 'react';
    import { Navigate, Outlet } from 'react-router-dom';
    import { useAuth } from '@/hooks/useAuth';
    import { Layout } from '@/components/layout/Layout'; // Assuming Layout handles role-based views or separate layouts

    const ProtectedRoute = ({ allowedRoles }) => {
      const { isAuthenticated, role, loading } = useAuth();

      if (loading) {
        return <div>Loading...</div>; // Or a proper loading spinner
      }

      if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
      }

      if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to a generic dashboard or an unauthorized page
        return <Navigate to={role === 'Admin' ? '/admin/dashboard' : '/partner/dashboard'} replace />; 
      }
      
      // Pass role to Layout if it needs to render differently
      return <Layout currentRole={role}><Outlet /></Layout>;
    };

    export default ProtectedRoute;