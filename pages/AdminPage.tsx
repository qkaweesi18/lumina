import React, { useState, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, PaymentStatus, PaymentMethod } from '../types';
import {
  Trash2, Plus, Sparkles, Image as ImageIcon, Loader2,
  Upload, X, Lock, Eye, EyeOff,
  Package, ShoppingBag, Clock, CheckCircle, XCircle,
  ChevronDown, ChevronUp, Mail, Phone, MapPin, User,
  DollarSign, BarChart3, Filter, Search, ArrowUpDown
} from 'lucide-react';
import { generateProductDescription } from '../services/geminiService';
import { Navigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const quillStyle = `.ql-editor { min-height: 120px; max-height: 300px; overflow-y: auto; }`;

// 🔐 Admin password — only you know this
const ADMIN_PASSWORD = 'Lumina@Admin2026';

type AdminTab = 'orders' | 'products';

export const AdminPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, isAdminMode, orders, updateOrderStatus, placeOrder, cart } = useShop();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('lumina_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', price: '', category: '', image: '', description: '' });
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [editGalleryImages, setEditGalleryImages] = useState<string[]>([]);
  const editGalleryFileInputRef = useRef<HTMLInputElement>(null);
  const [newGalleryImages, setNewGalleryImages] = useState<string[]>([]);
  const newGalleryFileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', price: '', category: '', image: '', description: '', keywords: ''
  });

  // 🔐 Password gate — safe box login
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('lumina_admin_auth', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Only the store owner can access this panel.');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lumina_admin_auth');
    setPasswordInput('');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md w-full">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-500 mb-8">Enter your admin password to manage products and orders.</p>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(''); }}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-center text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {passwordError && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{passwordError}</p>
            )}
            
            <button
              type="submit"
              className="w-full px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
            >
              Unlock Dashboard
            </button>
          </form>
          
          <p className="text-xs text-gray-400 mt-6">🔐 This panel is password-protected like a safe box.</p>
        </div>
      </div>
    );
  }

  // --- Order Stats ---
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.paymentStatus === 'pending').length;
  const completedOrders = orders.filter(o => o.paymentStatus === 'completed' || o.paymentStatus === 'paid').length;
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'completed' || o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  // --- Filtered Orders ---
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.paymentStatus === statusFilter;
    const matchesSearch = searchQuery === '' ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // --- Product Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData(prev => ({ ...prev, image: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleNewGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setNewGalleryImages(prev => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewGalleryImage = (index: number) => {
    setNewGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  // Edit product handlers
  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category || '',
      image: product.image,
      description: product.description
    });
    setEditImagePreview(product.image);
    setEditGalleryImages(product.images || []);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'image') setEditImagePreview(value || null);
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Image must be less than 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setEditFormData(prev => ({ ...prev, image: base64 }));
      setEditImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleEditGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setEditGalleryImages(prev => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEditGalleryImage = (index: number) => {
    setEditGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const saveEdit = () => {
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      name: editFormData.name,
      price: parseFloat(editFormData.price),
      category: editFormData.category || 'Uncategorized',
      image: editFormData.image || `https://picsum.photos/seed/${Date.now()}/800/800`,
      description: editFormData.description,
      images: editGalleryImages
    });
    setEditingProduct(null);
    setSuccessMessage('Product updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditImagePreview(null);
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) { alert("Please enter a product name first."); return; }
    setIsGenerating(true);
    const desc = await generateProductDescription(formData.name, formData.keywords || formData.category);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category || 'Uncategorized',
      image: formData.image || `https://picsum.photos/seed/${Date.now()}/800/800`,
      description: formData.description,
      reviews: [],
      images: newGalleryImages
    } as Product;
    addProduct(newProduct);
    setSuccessMessage('Product added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setFormData({ name: '', price: '', category: '', image: '', description: '', keywords: '' });
    setImagePreview(null);
    setNewGalleryImages([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (newGalleryFileInputRef.current) newGalleryFileInputRef.current.value = '';
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  // --- Order Helpers ---
  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'paid': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'paid': return <DollarSign className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const placeTestOrder = () => {
    const testNames = ['Thabo Molefe', 'Sarah van der Merwe', 'James Nkosi', 'Priya Patel', 'David Lee'];
    const testEmails = ['thabo@test.co.za', 'sarah.vdm@test.co.za', 'james.n@test.co.za', 'priya.p@test.co.za', 'david.l@test.co.za'];
    const testPhones = ['+27 82 111 2222', '+27 83 333 4444', '+27 72 555 6666', '+27 84 777 8889', '+27 61 999 0000'];
    const testAddresses = ['12 Loop Street, Cape Town', '45 Rivonia Rd, Sandton', '7 North Beach Rd, Durban', '3 Hatfield St, Pretoria', '8 Long Street, Cape Town'];
    const testCities = ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Cape Town'];
    const testProvinces = ['Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Gauteng', 'Western Cape'];
    const testPostalCodes = ['8001', '2196', '4001', '0002', '8001'];
    const testMethods: PaymentMethod[] = ['bank-transfer', 'payfast', 'bank-transfer', 'bank-transfer', 'payfast'];
    const testStatuses: PaymentStatus[] = ['pending', 'pending', 'completed', 'pending', 'paid'];

    const i = orders.length % 5;
    const randomProduct = products[Math.floor(Math.random() * products.length)] || products[0];

    if (!randomProduct) return;

    placeOrder(
      {
        name: testNames[i],
        email: testEmails[i],
        phone: testPhones[i],
        address: testAddresses[i],
        city: testCities[i],
        province: testProvinces[i],
        postalCode: testPostalCodes[i],
      },
      testMethods[i],
      testStatuses[i],
      true
    );
    setSuccessMessage(`Test order placed for ${testNames[i]}!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
           d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 bg-gray-50 min-h-screen">
      <style>{quillStyle}</style>

      {/* Header */}
      <div className="mb-8 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your orders, products, and store.</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Lock className="w-4 h-4" />
            Lock Dashboard
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-200 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Orders
          {pendingOrders > 0 && (
            <span className="ml-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingOrders}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" />
          Products
        </button>
      </div>

      {/* ==================== ORDERS TAB ==================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">{pendingOrders}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">R{totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Order Button */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Testing Mode</p>
              <p className="text-xs text-blue-600">Click below to simulate a customer order for testing the admin workflow.</p>
            </div>
            <button
              onClick={placeTestOrder}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Place Test Order
            </button>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'all')}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  {orders.length === 0 ? 'No orders yet' : 'No orders match your search'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {orders.length === 0 ? 'Orders will appear here when customers place them.' : 'Try adjusting your filters.'}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  return (
                    <li key={order.id} className="hover:bg-gray-50 transition-colors">
                      {/* Order Summary Row */}
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {order.customer.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Order #{order.id.slice(0, 8).toUpperCase()} · {formatDate(order.date)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Payment Method Badge */}
                            <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${
                              order.paymentMethod === 'bank-transfer'
                                ? 'bg-orange-50 text-orange-700 border-orange-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                              {order.paymentMethod === 'bank-transfer' ? '🏦 Bank Transfer' : '💳 PayFast'}
                            </span>

                            {/* Status Badge */}
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.paymentStatus)}`}>
                              {getStatusIcon(order.paymentStatus)}
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </span>

                            {/* Total */}
                            <span className="text-sm font-bold text-gray-900 w-20 text-right">
                              R{order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Order Details */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">

                            {/* Customer Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" />
                                Customer Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <p className="flex items-center gap-2 text-gray-700">
                                  <User className="w-3.5 h-3.5 text-gray-400" />
                                  {order.customer.name}
                                </p>
                                <p className="flex items-center gap-2 text-gray-700">
                                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                                  {order.customer.email}
                                </p>
                                <p className="flex items-center gap-2 text-gray-700">
                                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                                  {order.customer.phone}
                                </p>
                                <div className="flex items-start gap-2 text-gray-700">
                                  <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                                  <span>
                                    {order.customer.address}<br />
                                    {order.customer.city}, {order.customer.province} {order.customer.postalCode}
                                  </span>
                                </div>
                              </div>
                              <p className="mt-3 text-xs text-gray-400">
                                {order.isGuest ? '👤 Guest checkout' : '🔑 Registered user'}
                              </p>
                            </div>

                            {/* Order Items */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Package className="w-4 h-4 text-gray-500" />
                                Order Items
                              </h4>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                      <p className="text-xs text-gray-500">Qty: {item.quantity} × R{item.price.toFixed(2)}</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                      R{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                ))}
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Total</span>
                                    <span className="font-bold text-gray-900">R{order.total.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Status Actions */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                                Update Status
                              </h4>
                              <p className="text-xs text-gray-500 mb-3">
                                Current: <span className={`font-medium ${getStatusColor(order.paymentStatus).split(' ')[1]}`}>
                                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                </span>
                              </p>
                              <div className="space-y-2">
                                {order.paymentMethod === 'bank-transfer' && order.paymentStatus === 'pending' && (
                                  <>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'completed'); }}
                                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      Mark as Completed
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'cancelled'); }}
                                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200 transition-colors"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Cancel Order
                                    </button>
                                  </>
                                )}
                                {order.paymentMethod === 'bank-transfer' && order.paymentStatus === 'completed' && (
                                  <p className="text-sm text-green-700 bg-green-50 p-3 rounded-md text-center">
                                    ✅ Payment confirmed & order completed
                                  </p>
                                )}
                                {order.paymentMethod === 'bank-transfer' && order.paymentStatus === 'cancelled' && (
                                  <p className="text-sm text-red-700 bg-red-50 p-3 rounded-md text-center">
                                    ❌ Order has been cancelled
                                  </p>
                                )}
                                {order.paymentMethod === 'payfast' && (
                                  <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-md text-center">
                                    💳 Payment processed via PayFast
                                  </p>
                                )}
                                {order.paymentStatus === 'pending' && order.paymentMethod === 'payfast' && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'completed'); }}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Mark as Completed
                                  </button>
                                )}
                                {order.paymentStatus === 'pending' && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'failed'); }}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Mark as Failed
                                  </button>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* ==================== PRODUCTS TAB ==================== */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Add Product Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" /> Add New Product
              </h2>

              {successMessage && (
                <div className="mb-4 p-2 bg-green-50 text-green-700 rounded-md text-sm border border-green-200">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text" name="name" required value={formData.name} onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    placeholder="e.g. Linen Shirt"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (R)</label>
                    <input
                      type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 bg-white"
                    >
                      <option value="">Select...</option>
                      <option value="Apparel">Apparel</option>
                      <option value="Home">Home</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Art">Art</option>
                      <option value="Tech">Tech</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  
                  {/* Image Preview */}
                  {(imagePreview || formData.image) && (
                    <div className="relative mb-3 inline-block">
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* File Upload Button */}
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 hover:border-gray-300 transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      {formData.image ? 'Change Image' : 'Upload from Computer'}
                    </label>
                    <span className="text-xs text-gray-400">JPG, PNG, GIF • Max 5MB</span>
                  </div>

                  {/* OR divider */}
                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="text-xs text-gray-400 font-medium">OR</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>

                  {/* URL Input Fallback */}
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      https://
                    </span>
                    <input type="text" name="image" value={formData.image.startsWith('data:') ? '' : formData.image} onChange={handleInputChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Or paste image URL here"
                    />
                  </div>
                </div>

                {/* Gallery Images for New Product */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (Optional)</label>
                  <p className="text-xs text-gray-400 mb-3">Additional images that appear as clickable thumbnails on the product page.</p>

                  {/* Gallery Preview Grid */}
                  {newGalleryImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {newGalleryImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square">
                          <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                          <button type="button" onClick={() => removeNewGalleryImage(idx)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  <input ref={newGalleryFileInputRef} type="file" accept="image/*" multiple onChange={handleNewGalleryUpload} className="hidden" id="new-gallery-upload" />
                  <label htmlFor="new-gallery-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 hover:border-gray-300 transition-all">
                    <Upload className="w-4 h-4" />
                    Add Gallery Images
                  </label>
                  <span className="text-xs text-gray-400 ml-2">Select multiple files at once</span>
                </div>

                {/* AI Section */}
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <label className="block text-xs font-semibold text-blue-800 uppercase tracking-wide mb-2">
                    <Sparkles className="w-3 h-3 inline mr-1" /> AI Assistant
                  </label>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Keywords for AI</label>
                    <input type="text" name="keywords" value={formData.keywords} onChange={handleInputChange}
                      placeholder="e.g. soft, durable, summer vibes"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                  </div>
                  <button type="button" onClick={handleGenerateDescription} disabled={isGenerating || !formData.name}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                  >
                    {isGenerating ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    {isGenerating ? 'Writing...' : 'Generate Description'}
                  </button>
                </div>

                <div>
                                  <label className="block text-sm font-medium text-gray-700">Description</label>
                                  <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                    modules={{
                                      toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                        ['blockquote'],
                                        ['link'],
                                        ['clean']
                                      ]
                                    }}
                                    placeholder="Write product description..."
                                    className="mt-1 bg-white"
                                  />
                                </div>

                <button type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Add Product
                </button>
              </form>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Current Inventory</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {products.length === 0 && (
                  <li className="p-8 text-center text-gray-500">No products yet. Add one!</li>
                )}
                {products.map((product) => (
                  <li key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                        <img className="h-full w-full object-cover" src={product.image} alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500 truncate">{product.category}</p>
                        <p className="text-sm font-bold text-gray-900">R{product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(product)}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(product.id)}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                <button onClick={cancelEdit} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input type="text" name="name" value={editFormData.name} onChange={handleEditInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (R)</label>
                    <input type="number" name="price" min="0" step="0.01" value={editFormData.price} onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" value={editFormData.category} onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 bg-white"
                    >
                      <option value="">Select...</option>
                      <option value="Apparel">Apparel</option>
                      <option value="Home">Home</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Art">Art</option>
                      <option value="Tech">Tech</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  {editImagePreview && (
                    <div className="relative mb-3 inline-block">
                      <img src={editImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
                      <button type="button" onClick={() => { setEditFormData(prev => ({ ...prev, image: '' })); setEditImagePreview(null); }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <input ref={editFileInputRef} type="file" accept="image/*" onChange={handleEditImageUpload} className="hidden" id="edit-image-upload" />
                    <label htmlFor="edit-image-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 hover:border-gray-300 transition-all">
                      <Upload className="w-4 h-4" />
                      {editFormData.image ? 'Change Image' : 'Upload from Computer'}
                    </label>
                    <span className="text-xs text-gray-400">JPG, PNG, GIF • Max 5MB</span>
                  </div>
                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="text-xs text-gray-400 font-medium">OR</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                  <input type="text" name="image" value={editFormData.image.startsWith('data:') ? '' : editFormData.image} onChange={handleEditInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    placeholder="Or paste image URL here"
                  />
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (Preview Thumbnails)</label>
                  <p className="text-xs text-gray-400 mb-3">These images appear as clickable thumbnails on the product page.</p>
                  
                  {/* Gallery Preview Grid */}
                  {editGalleryImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {editGalleryImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square">
                          <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                          <button type="button" onClick={() => removeEditGalleryImage(idx)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  <input ref={editGalleryFileInputRef} type="file" accept="image/*" multiple onChange={handleEditGalleryUpload} className="hidden" id="edit-gallery-upload" />
                  <label htmlFor="edit-gallery-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 hover:border-gray-300 transition-all">
                    <Upload className="w-4 h-4" />
                    Add Gallery Images
                  </label>
                  <span className="text-xs text-gray-400 ml-2">Select multiple files at once</span>
                </div>

                <div>
                                  <label className="block text-sm font-medium text-gray-700">Description</label>
                                  <ReactQuill
                                    theme="snow"
                                    value={editFormData.description}
                                    onChange={(value) => setEditFormData(prev => ({ ...prev, description: value }))}
                                    modules={{
                                      toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                        ['blockquote'],
                                        ['link'],
                                        ['clean']
                                      ]
                                    }}
                                    placeholder="Write product description..."
                                    className="mt-1 bg-white"
                                  />
                                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={cancelEdit}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={saveEdit}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
