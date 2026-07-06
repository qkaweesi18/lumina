import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowRight, Sparkles, Package, Truck, Shield, Globe, MessageCircle, Mail } from 'lucide-react';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const { products } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Enhanced with animations */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 gradient-animate opacity-90" />

        {/* Background image with parallax-like effect */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Hero background"
            className="w-full h-full object-cover opacity-30 transform scale-105 hover:scale-100 transition-transform duration-[3000ms]"
          />
        </div>

        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl float" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl float" style={{ animationDelay: '1s' }} />

        <div className={`relative max-w-7xl mx-auto py-28 px-4 sm:py-40 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm mb-6 border border-white/20 animate-fade-in-down">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-gray-200">New Collection 2026</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6 animate-fade-in-up">
            <span className="block">Refined</span>
            <span className="block bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">Essentials</span>
          </h1>

          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
            Curated minimalism for your home and lifestyle. Simple, functional, and beautiful.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <a
              href="#collection"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-all hover:gap-4 btn-shine shadow-lg hover:shadow-xl"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              to="/learn-more"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse-soft" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Package, title: 'Premium Quality', desc: 'Handpicked products that meet our high standards' },
              { icon: Truck, title: 'Free Shipping', desc: 'On all orders over R150 worldwide' },
              { icon: Shield, title: 'Secure Checkout', desc: 'Your data is protected with SSL encryption' },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm hover-lift animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards', opacity: 0 }}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16" style={{ scrollMarginTop: '80px' }}>

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Collection</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Discover our carefully curated selection of minimalist essentials designed to elevate your everyday experience.</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
            {categories.map((cat, index) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${selectedCategory === cat
                    ? 'bg-black text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                  }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent sm:text-sm transition-all"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-6 xl:gap-x-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <SlidersHorizontal className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try changing your search terms or category.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-10 bg-white text-gray-900 flex items-center justify-center rounded-full text-lg font-bold">L</span>
                <span className="text-2xl font-bold">Lumina</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Curated minimalism for your home and lifestyle. We believe in quality over quantity,
                creating products that are built to last and designed to inspire.
              </p>
              <div className="flex gap-4">
                {[Globe, MessageCircle, Mail].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold mb-4">Shop</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors underline-slide">All Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors underline-slide">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white transition-colors underline-slide">Best Sellers</a></li>
                <li><a href="#" className="hover:text-white transition-colors underline-slide">Sale</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors underline-slide">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors underline-slide">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors underline-slide">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors underline-slide">Returns</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2026 Lumina Store. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
