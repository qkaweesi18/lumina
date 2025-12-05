import React, { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setMounted(false), 500);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={handleClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pointer-events-none">
        <div
          className={`pointer-events-auto w-screen max-w-md transform transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) bg-white shadow-2xl flex flex-col h-full ${isOpen && !isClosing ? 'translate-x-0' : 'translate-x-full'
            }`}
        >

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white z-10">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-gray-900" />
              <h2 className="text-lg font-bold text-gray-900">Your Bag <span className="text-gray-400 font-normal">({cart.length})</span></h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center animate-pulse-soft">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce-in" style={{ animationDelay: '0.2s' }}>
                    <span className="text-xl">?</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your bag is empty</h3>
                  <p className="text-gray-500 max-w-xs mx-auto">Looks like you haven't added anything to your bag yet.</p>
                </div>
                <button
                  onClick={handleClose}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <ul className="space-y-6">
                {cart.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex py-2 animate-slide-in-right"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="line-clamp-2 pr-4">
                            <Link to={`/product/${item.id}`} onClick={handleClose} className="hover:text-blue-600 transition-colors">
                              {item.name}
                            </Link>
                          </h3>
                          <p className="whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                      </div>

                      <div className="flex flex-1 items-end justify-between text-sm mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-2 hover:bg-gray-200 rounded-l-lg text-gray-600 disabled:opacity-50 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 font-medium text-gray-900 min-w-[1.5rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-2 hover:bg-gray-200 rounded-r-lg text-gray-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="font-medium text-red-500 hover:text-red-700 flex items-center gap-1.5 p-2 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-xs">Remove</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-6 bg-gray-50/50 backdrop-blur-sm">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-base text-gray-500">
                  <p>Subtotal</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base text-gray-500">
                  <p>Shipping</p>
                  <p className="text-green-600 font-medium">Free</p>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <p>Total</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/checkout"
                  onClick={handleClose}
                  className="w-full flex items-center justify-center gap-2 rounded-full border border-transparent bg-black px-6 py-4 text-base font-medium text-white shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 btn-shine"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  className="w-full flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-4 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all duration-300"
                  onClick={handleClose}
                >
                  Continue Shopping
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Package className="w-3 h-3" />
                <span>Free shipping on all orders</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
