import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { CartSidebar } from './components/CartSidebar';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { AdminPage } from './pages/AdminPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { LearnMorePage } from './pages/LearnMorePage';

// Saves & restores scroll position when navigating between pages
const ScrollRestoration: React.FC = () => {
  const location = useLocation();
  const lastPath = useRef(location.pathname + location.hash);
  const isBack = useRef(false);

  useEffect(() => {
    // Save scroll position before navigating away
    const handleBeforeUnload = () => {
      sessionStorage.setItem(`scroll_${lastPath.current}`, String(window.scrollY));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Also save on route change
    return () => {
      sessionStorage.setItem(`scroll_${lastPath.current}`, String(window.scrollY));
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const savedKey = `scroll_${location.pathname}${location.hash}`;
    const saved = sessionStorage.getItem(savedKey);
    if (saved) {
      window.scrollTo(0, parseInt(saved, 10));
    } else {
      window.scrollTo(0, 0);
    }
    lastPath.current = location.pathname + location.hash;
  }, [location.pathname, location.hash]);

  return null;
};

const AppContent: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <ScrollRestoration />
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
        <Route path="/learn-more" element={<LearnMorePage />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <AppContent />
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
};

export default App;
