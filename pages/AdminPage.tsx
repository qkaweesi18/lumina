import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { Trash2, Plus, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { generateProductDescription } from '../services/geminiService';
import { Navigate } from 'react-router-dom';

export const AdminPage: React.FC = () => {
  const { products, addProduct, deleteProduct, isAdminMode } = useShop();
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    keywords: '' // Used for AI generation
  });

  if (!isAdminMode) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) {
      alert("Please enter a product name first.");
      return;
    }
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
      reviews: []
    };
    addProduct(newProduct);
    setSuccessMessage('Product added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    // Reset form
    setFormData({
      name: '',
      price: '',
      category: '',
      image: '',
      description: '',
      keywords: ''
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your inventory and add new products.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Add Product Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
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
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  placeholder="e.g. Linen Shirt"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
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
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    http://
                  </span>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Leave empty for random"
                  />
                </div>
              </div>

              {/* AI Section */}
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <label className="block text-xs font-semibold text-blue-800 uppercase tracking-wide mb-2">
                  <Sparkles className="w-3 h-3 inline mr-1" /> AI Assistant
                </label>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords for AI</label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    placeholder="e.g. soft, durable, summer vibes"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating || !formData.name}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {isGenerating ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  {isGenerating ? 'Writing...' : 'Generate Description'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
                      <p className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleDelete(product.id)}
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
    </div>
  );
};