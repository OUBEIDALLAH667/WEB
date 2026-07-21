import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { FullPageLoader } from './components/ui/LoadingSpinner';
import { useAuth } from './context/AuthContext';

// Public pages
import { HomePage } from './pages/public/HomePage';
import { CataloguePage } from './pages/public/CataloguePage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { DiagnosticPage } from './pages/public/DiagnosticPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Client pages
import { AccountPage } from './pages/client/AccountPage';
import { OrdersPage } from './pages/client/OrdersPage';
import { AppointmentsPage } from './pages/client/AppointmentsPage';

// Admin pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminDiagnostics } from './pages/admin/AdminDiagnostics';
import { AdminAppointments } from './pages/admin/AdminAppointments';

// Checkout
import { CheckoutPage } from './pages/CheckoutPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { profile, loading } = useAuth();

  if (loading) return <FullPageLoader />;
  if (!profile) return <LoginPage />;
  if (requireAdmin && !profile.is_admin) return <HomePage />;
  return <>{children}</>;
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) return <FullPageLoader />;

  return (
    <Routes>
      {/* Auth (standalone) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Main layout routes */}
      <Route path="/*" element={
        <>
          <Navbar />
          <CartDrawer />
          <main>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogue" element={<CataloguePage />} />
              <Route path="/produit/:id" element={<ProductDetailPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/diagnostic" element={<DiagnosticPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />

              {/* Client area */}
              <Route path="/compte" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/compte/commandes" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/compte/rendez-vous" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />

              {/* Admin area */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="produits" element={<AdminProducts />} />
                <Route path="commandes" element={<AdminOrders />} />
                <Route path="diagnostics" element={<AdminDiagnostics />} />
                <Route path="rendez-vous" element={<AdminAppointments />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
