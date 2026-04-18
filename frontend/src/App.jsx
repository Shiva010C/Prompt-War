import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import BroadcastBanner from './components/BroadcastBanner';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Lazy loading pages
const Home = lazy(() => import('./pages/Home'));
const Ticket = lazy(() => import('./pages/Ticket'));
const Food = lazy(() => import('./pages/Food'));
const Map = lazy(() => import('./pages/Map'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-surface">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Guard: Admin route only accessible if authenticated
function AdminRoute() {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Admin />;
}

function AppRoutes() {
  return (
    <div className="dark min-h-screen bg-surface">
      <ToastProvider>
        <CartProvider>
          <TopNav />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ticket" element={<Ticket />} />
              <Route path="/food" element={<Food />} />
              <Route path="/map" element={<Map />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminRoute />} />
            </Routes>
          </Suspense>
          <BottomNav />
        </CartProvider>
      </ToastProvider>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
