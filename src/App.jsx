import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { ForgotPasswordPage } from './pages/ForgotPassword';
import DeveloperDashboard from './pages/DeveloperDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminPage from './pages/AdminPage';
import Landing from './pages/Landing';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import SellerOnboarding from './pages/SellerOnboarding';
import SellerDashboard from './pages/SellerDashboard';

function App() {
  return (
    <Router>
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
          <Route path="/buyer" element={<BuyerDashboard />} />
          <Route path="/seller-onboarding" element={<SellerOnboarding />} />
          <Route path="/seller" element={<SellerDashboard />} />
        </Route>

        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
