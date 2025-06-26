import React from 'react';
        import { Routes, Route, Navigate } from 'react-router-dom';
        import ProtectedRoute from '@/components/ProtectedRoute';
        import LoginPage from '@/pages/auth/LoginPage';
        import SignUpPage from '@/pages/auth/SignUpPage';
        import PasswordResetPage from '@/pages/auth/PasswordResetPage';
        
        import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
        import PartnerDashboardPage from '@/pages/partner/PartnerDashboardPage';

        import RepairOrdersPage from '@/pages/RepairOrdersPage'; // Changed from TicketsPage
        import InventoryPage from '@/pages/InventoryPage';
        import PartnersPage from '@/pages/PartnersPage';
        import ReportsPage from '@/pages/ReportsPage';
        import SettingsPage from '@/pages/SettingsPage';
        import { useAuth } from '@/hooks/useAuth';
        import { useTranslation } from 'react-i18next'; // For loading text

        const AppRoutes = () => {
          const { isAuthenticated, role, loading } = useAuth();
          const { t } = useTranslation();

          if (loading) {
            return (
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="ml-4 text-lg font-medium">{t('loading', 'Loading...')}</p>
              </div>
            );
          }
          
          return (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/password-reset" element={<PasswordResetPage />} />

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/repair-orders" element={<RepairOrdersPage />} /> 
                <Route path="/admin/inventory" element={<InventoryPage />} />
                <Route path="/admin/partners" element={<PartnersPage />} />
                <Route path="/admin/reports" element={<ReportsPage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
              </Route>

              {/* Partner Routes */}
              <Route element={<ProtectedRoute allowedRoles={['Partner']} />}>
                <Route path="/partner/dashboard" element={<PartnerDashboardPage />} />
                <Route path="/partner/repair-orders" element={<RepairOrdersPage />} />
                <Route path="/partner/settings" element={<SettingsPage />} /> {/* Limited settings for partner */}
              </Route>
              
              <Route 
                path="*" 
                element={
                  isAuthenticated 
                    ? (role === 'Admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/partner/dashboard" replace />)
                    : <Navigate to="/login" replace />
                } 
              />
            </Routes>
          );
        }

        function App() {
          return (
            <AppRoutes />
          );
        }

        export default App;