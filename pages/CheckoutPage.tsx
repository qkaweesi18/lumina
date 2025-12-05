import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Truck, CreditCard, CheckCircle, Lock } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, placeOrder } = useShop();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    card: '',
    expiry: '',
    cvc: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 animate-fade-in">
        <div className="text-center max-w-md w-full px-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API delay
    setTimeout(() => {
      placeOrder({
        name: formData.name,
        email: formData.email,
        address: formData.address
      });
      setIsProcessing(false);
      alert('Order Placed Successfully! (Simulation)');
      navigate('/');
    }, 2000);
  };

  const InputField = ({ label, name, type = "text", placeholder, icon: Icon, width = "full" }: any) => (
    <div className={`${width === 'half' ? 'sm:col-span-1' : 'sm:col-span-2'} relative`}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === name
          ? 'border-black ring-1 ring-black shadow-sm'
          : 'border-gray-200 hover:border-gray-300'
        }`}>
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 transition-colors ${focusedField === name ? 'text-black' : 'text-gray-400'}`} />
          </div>
        )}
        <input
          type={type}
          name={name}
          required
          value={(formData as any)[name]}
          onChange={handleInputChange}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField(null)}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl border-none focus:ring-0 sm:text-sm bg-transparent`}
          placeholder={placeholder}
        />
        {(formData as any)[name] && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none animate-scale-in">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:px-6 lg:px-8">
        <Link to="/" className="text-gray-500 hover:text-black flex items-center text-sm font-medium mb-8 transition-colors group w-fit">
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </Link>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">

          {/* Order Summary (Right side on desktop) */}
          <section className="lg:col-span-5 lg:order-last mb-8 lg:mb-0 animate-fade-in-up stagger-2">
            <div className="bg-white shadow-xl shadow-gray-200/50 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                Order Summary
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{cart.length} items</span>
              </h2>
              <ul className="divide-y divide-gray-100 mb-6 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {cart.map((item) => (
                  <li key={item.id} className="flex py-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-center">
                      <div className="flex justify-between text-sm font-medium text-gray-900">
                        <h3 className="line-clamp-1">{item.name}</h3>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{item.category} · Qty {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium text-gray-900">${cartTotal.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium text-green-600">Free</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-base font-bold text-gray-900">Total</p>
                  <p className="text-xl font-bold text-gray-900">${cartTotal.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-green-700 text-xs bg-green-50 p-3 rounded-xl border border-green-100">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-medium">Secure Checkout Simulation</span>
              </div>
            </div>
          </section>

          {/* Checkout Form */}
          <section className="lg:col-span-7 animate-fade-in-up stagger-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="mt-2 text-gray-500">Complete your order details below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Contact Info */}
              <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">1</div>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                  <InputField label="Full Name" name="name" placeholder="John Doe" />
                  <InputField label="Email Address" name="email" type="email" placeholder="john@example.com" />
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">2</div>
                  Shipping Details
                </h2>
                <div className="grid grid-cols-1 gap-y-6">
                  <InputField label="Shipping Address" name="address" placeholder="123 Main St, Apt 4B, New York, NY" icon={Truck} />
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">3</div>
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                  <InputField label="Card Number" name="card" placeholder="0000 0000 0000 0000" icon={CreditCard} />
                  <InputField label="Expiry Date" name="expiry" placeholder="MM/YY" width="half" />
                  <InputField label="CVC" name="cvc" placeholder="123" width="half" icon={Lock} />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all transform active:scale-[0.99] ${isProcessing ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-xl btn-shine'
                    }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="spinner border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay ${cartTotal.toFixed(2)}
                      <ShieldCheck className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Payments are secure and encrypted
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

import { ShoppingBag } from 'lucide-react';
