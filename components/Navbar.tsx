import React, { useState, useEffect } from 'react';
import { ShoppingBag, LayoutDashboard, Store, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from './LoginModal';

interface NavbarProps {
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const { cartCount, isAdminMode, toggleAdminMode } = useShop();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [animateBadge, setAnimateBadge] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate cart badge on change
  useEffect(() => {
    if (cartCount > 0) {
      setAnimateBadge(true);
      const timer = setTimeout(() => setAnimateBadge(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <>
      <nav
        className={`fixed top-0 z-40 w-full transition-all duration-300 ${scrolled
            ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-2'
            : 'bg-transparent py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center animate-fade-in-down">
              <Link to="/" className="group flex items-center gap-2">
                <div className="relative w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg overflow-hidden transition-transform group-hover:scale-110 duration-300">
                  <span className="relative z-10 font-bold text-sm">L</span>
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${scrolled || location.pathname !== '/' ? 'text-gray-900' : 'text-white md:text-white text-gray-900'
                  }`}>
                  Lumina
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8 animate-fade-in-down stagger-1">
              <Link
                to="/"
                className={`text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 relative group ${(scrolled || location.pathname !== '/')
                    ? (location.pathname === '/' && !isAdminMode ? 'text-black' : 'text-gray-600 hover:text-black')
                    : 'text-white/80 hover:text-white'
                  }`}
              >
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full" />
              </Link>

              <button
                onClick={() => {
                  navigate('/admin');
                }}
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${(scrolled || location.pathname !== '/')
                    ? (isAdminMode ? 'text-blue-600' : 'text-gray-600 hover:text-black')
                    : 'text-white/80 hover:text-white'
                  }`}
              >
                {isAdminMode ? <Store className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
                {isAdminMode ? 'Exit Seller Mode' : 'Sell Products'}
              </button>

              <div className="h-6 w-px bg-gray-200/20 mx-2" />

              <button
                onClick={onOpenCart}
                className={`relative p-2 rounded-full transition-all duration-300 hover:bg-white/10 ${(scrolled || location.pathname !== '/') ? 'text-gray-900 hover:bg-gray-100' : 'text-white'
                  }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className={`absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-blue-600 rounded-full border-2 border-white ${animateBadge ? 'cart-badge-pop' : ''
                      }`}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative group">
                  <button className={`flex items-center gap-2 text-sm font-medium transition-colors ${(scrolled || location.pathname !== '/') ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
                    }`}>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border-2 border-white/20" />
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${(scrolled || location.pathname !== '/') ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white/10 border-white/20 text-white'
                        }`}>
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 translate-y-2 group-hover:translate-y-0 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.displayName || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => logout()}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className={`text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 ${(scrolled || location.pathname !== '/')
                      ? 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                      : 'bg-white text-black hover:bg-gray-100 shadow-lg'
                    }`}
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4 animate-fade-in-down">
              <button
                onClick={onOpenCart}
                className={`relative p-2 ${(scrolled || location.pathname !== '/') ? 'text-gray-900' : 'text-white'
                  }`}
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className={`absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-blue-600 rounded-full border-2 border-white ${animateBadge ? 'cart-badge-pop' : ''}`}>
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md focus:outline-none transition-colors ${(scrolled || location.pathname !== '/') ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                  }`}
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu Panel */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="text-lg font-bold">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 py-6 space-y-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-all"
            >
              <Store className="w-5 h-5" /> Shop
            </Link>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/admin');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-all"
            >
              <LayoutDashboard className="w-5 h-5" />
              {isAdminMode ? 'Exit Seller Mode' : 'Sell Your Products'}
            </button>

            <div className="border-t border-gray-100 my-4 pt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full border border-gray-200" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.displayName || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-white bg-black hover:bg-gray-800 transition-all shadow-lg"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};
