import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';

// Lazy loading pages for efficiency
const Home = lazy(() => import('./pages/Home'));
const Ticket = lazy(() => import('./pages/Ticket'));
const Food = lazy(() => import('./pages/Food'));
const Map = lazy(() => import('./pages/Map'));
const Admin = lazy(() => import('./pages/Admin'));

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-surface">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="dark">
        <ToastProvider>
          <CartProvider>
            <TopNav />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ticket" element={<Ticket />} />
                <Route path="/food" element={<Food />} />
                <Route path="/map" element={<Map />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
            <BottomNav />
          </CartProvider>
        </ToastProvider>
      </div>
    </Router>
  );
}

export default App;
