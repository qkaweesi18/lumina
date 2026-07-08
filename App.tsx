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
  const prevPath = useRef(location.pathname + location.hash);
  const savedScrollRef = useRef<number>(0);

  useEffect(() => {
    // Intercept ALL clicks on internal links to save scroll position BEFORE React Router processes
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.getAttribute('href')?.startsWith('#/')) {
        // Save immediately — this runs BEFORE React Router's location change
        const currentKey = `scroll_${location.pathname}${location.hash}`;
        sessionStorage.setItem(currentKey, String(window.scrollY));
        savedScrollRef.current = window.scrollY;
      }
    };
    document.addEventListener('click', handleClick, true);

    // Also handle browser back/forward buttons
    const handlePopState = () => {
      const currentKey = `scroll_${location.pathname}${location.hash}`;
      sessionStorage.setItem(currentKey, String(window.scrollY));
      savedScrollRef.current = window.scrollY;
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, location.hash]);

  useEffect(() => {
    // Check if we already saved a position (from click interception)
    const newKey = `scroll_${location.pathname}${location.hash}`;
    const saved = sessionStorage.getItem(newKey);
    if (saved) {
      window.scrollTo(0, parseInt(saved, 10));
    } else {
      window.scrollTo(0, 0);
    }

    // Update previous path for next navigation
    prevPath.current = location.pathname + location.hash;
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
