import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { LoginPage } from './pages/Login';
import { ForgotPasswordPage } from './pages/ForgotPassword';
import Landing from './pages/Landing';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy load heavy dashboard components
const DeveloperDashboard = lazy(() => import('./pages/DeveloperDashboard'));
const BuyerDashboard = lazy(() => import('./pages/BuyerDashboard'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SellerOnboarding = lazy(() => import('./pages/SellerOnboarding'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const Maintenance = lazy(() => import('./pages/Maintenance'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-[#080c0a] flex items-center justify-center">
    <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
  </div>
);

// New Hosting Guard component
const HostingGuard = () => {
  const [isHosted, setIsHosted] = useState(true);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isAdmin = localStorage.getItem('userEmail') === 'admin@gmail.com';

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.from('system_settings').select('is_hosted').single();
        if (!error && data) {
          setIsHosted(data.is_hosted);
        }
      } catch (err) {
        console.error("Hosting check failed", err);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, [location.pathname]);

  if (loading) return <PageLoader />;

  // allow access to login and forgot-password even when site is down so admins can log in
  const isAuthPath = location.pathname.includes('/login') || location.pathname.includes('/forgot-password');

  // Only allow Admin to bypass the maintenance wall
  if (!isHosted && !isAdmin && !location.pathname.includes('/admin') && !isAuthPath) {
    return <Maintenance />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<HostingGuard />}>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            <Route element={<DashboardLayout />}>
              <Route path="/developer" element={<DeveloperDashboard />} />
              <Route path="/project-developer" element={<DeveloperDashboard />} />
              <Route path="/verifier" element={<DeveloperDashboard />} />
              <Route path="/buyer" element={<BuyerDashboard />} />
              <Route path="/seller-onboarding" element={<SellerOnboarding />} />
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
