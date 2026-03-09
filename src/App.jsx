import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
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

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-[#080c0a] flex items-center justify-center">
    <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
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
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
