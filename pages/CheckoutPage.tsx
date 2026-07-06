import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ShieldCheck, Truck, CreditCard, CheckCircle, Lock,
  ShoppingBag, Building2, User, Mail, Phone, MapPin, Globe,
  AlertCircle, Copy, Check, ExternalLink
} from 'lucide-react';
import { PaymentMethod } from '../types';

// PayFast configuration — your live merchant credentials
const PAYFAST_CONFIG = {
  merchantId: '34546199',         // Your PayFast merchant ID
  merchantKey: 'gxnkxus1xytxi',  // Your PayFast merchant key
  sandboxUrl: 'https://sandbox.payfast.co.za/eng/process',
  liveUrl: 'https://www.payfast.co.za/eng/process',
  useSandbox: true, // Set to false when going live with real payments
};

// Your banking details for manual transfer
const BANK_DETAILS = {
  bankName: 'FNB/RMB',
  accountHolder: 'Francis Kaweesi-Lwasampijja',
  accountNumber: '62889468891',
  branchCode: '250655',
  accountType: 'Easy Account',
  reference: 'Your order number will be displayed below',
};

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, placeOrder } = useShop();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank-transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [bankTransferConfirmed, setBankTransferConfirmed] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.province.trim()) newErrors.province = 'Province is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (paymentMethod === 'bank-transfer' && !bankTransferConfirmed) {
      newErrors.bankConfirm = 'Please confirm you have made the bank transfer';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderNumber = () => {
    return `LUM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);

    const orderNumber = generateOrderNumber();

    if (paymentMethod === 'payfast') {
      // Build PayFast form and redirect
      const order = placeOrder(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
        },
        'payfast',
        'pending',
        true
      );

      // Build PayFast form data
      const payfastUrl = PAYFAST_CONFIG.useSandbox ? PAYFAST_CONFIG.sandboxUrl : PAYFAST_CONFIG.liveUrl;
      const returnUrl = `${window.location.origin}/#/order-confirmation/${order.id}`;
      const cancelUrl = `${window.location.origin}/#/checkout`;
      const notifyUrl = `${window.location.origin}/api/payfast-notify`; // Server-side ITN endpoint

      const payfastData = {
        merchant_id: PAYFAST_CONFIG.merchantId,
        merchant_key: PAYFAST_CONFIG.merchantKey,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        notify_url: notifyUrl,
        name_first: formData.name.split(' ')[0] || formData.name,
        name_last: formData.name.split(' ').slice(1).join(' ') || '',
        email_address: formData.email,
        cell_number: formData.phone,
        m_payment_id: order.id,
        amount: cartTotal.toFixed(2),
        item_name: `Lumina Order - ${cart.length} item(s)`,
        item_description: cart.map(i => `${i.name} x${i.quantity}`).join(', '),
        // Pass custom variables for delivery
        custom_str1: formData.address,
        custom_str2: `${formData.city}, ${formData.province} ${formData.postalCode}`,
      };

      // Create and submit hidden form to PayFast
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payfastUrl;
      Object.entries(payfastData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);

      // Small delay for state to persist
      await new Promise(resolve => setTimeout(resolve, 500));
      form.submit();
      return;
    }

    // Bank Transfer — place order and show confirmation
    setTimeout(() => {
      const order = placeOrder(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
        },
        'bank-transfer',
        'pending',
        true
      );
      setIsProcessing(false);
      navigate(`/order-confirmation/${order.id}`);
    }, 1500);
  };

  const InputField = ({ label, name, type = "text", placeholder, icon: Icon, width = "full" }: any) => (
    <div className={`${width === 'half' ? 'sm:col-span-1' : 'sm:col-span-2'} relative`}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className={`relative rounded-xl border transition-all duration-300 ${
        errors[name] ? 'border-red-300 ring-1 ring-red-200' :
        focusedField === name
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
        {(formData as any)[name] && !errors[name] && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none animate-scale-in">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:px-6 lg:px-8">
        <Link to="/" className="text-gray-500 hover:text-black flex items-center text-sm font-medium mb-8 transition-colors group w-fit">
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </Link>

        {/* Guest Notice */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">Guest Checkout</p>
            <p className="text-xs text-blue-700 mt-0.5">No account needed — just fill in your details below to complete your purchase.</p>
          </div>
        </div>

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
                <span className="font-medium">Secure Checkout</span>
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

              {/* Section 1: Contact Info */}
              <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">1</div>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                  <InputField label="Full Name" name="name" placeholder="John Doe" icon={User} />
                  <InputField label="Email Address" name="email" type="email" placeholder="john@example.com" icon={Mail} />
                  <InputField label="Phone Number" name="phone" type="tel" placeholder="+27 82 000 0000" icon={Phone} />
                </div>
              </div>

              {/* Section 2: Shipping Address */}
              <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">2</div>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                  <InputField label="Street Address" name="address" placeholder="123 Main St, Apt 4B" icon={MapPin} />
                  <InputField label="City" name="city" placeholder="Cape Town" icon={Building2} width="half" />
                  <InputField label="Province" name="province" placeholder="Western Cape" icon={Globe} width="half" />
                  <InputField label="Postal Code" name="postalCode" placeholder="8001" width="half" />
                </div>
              </div>

              {/* Section 3: Payment Method */}
              <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">3</div>
                  Payment Method
                </h2>

                {/* Payment Method Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank-transfer')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      paymentMethod === 'bank-transfer'
                        ? 'border-black bg-gray-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        paymentMethod === 'bank-transfer' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Bank Transfer (EFT)</p>
                        <p className="text-xs text-gray-500 mt-0.5">Manual bank transfer — pay at your bank</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('payfast')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      paymentMethod === 'payfast'
                        ? 'border-black bg-gray-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        paymentMethod === 'payfast' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">PayFast Online</p>
                        <p className="text-xs text-gray-500 mt-0.5">Card, EFT, SnapScan & more</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Bank Transfer Details */}
                {paymentMethod === 'bank-transfer' && (
                  <div className="animate-fade-in-up space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-sm font-medium text-amber-900 flex items-center gap-2 mb-3">
                        <AlertCircle className="w-4 h-4" />
                        Transfer the exact amount to the account below
                      </p>

                      <div className="space-y-3 bg-white rounded-xl p-4 border border-amber-100">
                        {[
                          { label: 'Bank', value: BANK_DETAILS.bankName },
                          { label: 'Account Holder', value: BANK_DETAILS.accountHolder },
                          { label: 'Account Number', value: BANK_DETAILS.accountNumber },
                          { label: 'Branch Code', value: BANK_DETAILS.branchCode },
                          { label: 'Account Type', value: BANK_DETAILS.accountType },
                          { label: 'Reference', value: `LUM-${Date.now().toString(36).toUpperCase().slice(-6)}` },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                            <span className="text-xs text-gray-500">{label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono font-semibold text-gray-900">{value}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(value, label)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title={`Copy ${label}`}
                              >
                                {copiedField === label ? (
                                  <Check className="w-3 h-3 text-green-500" />
                                ) : (
                                  <Copy className="w-3 h-3 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-xs text-gray-500">Amount</span>
                          <span className="text-sm font-mono font-bold text-green-600">${cartTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Confirmation checkbox */}
                    <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      bankTransferConfirmed ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={bankTransferConfirmed}
                        onChange={(e) => {
                          setBankTransferConfirmed(e.target.checked);
                          if (errors.bankConfirm) setErrors(prev => ({ ...prev, bankConfirm: '' }));
                        }}
                        className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">I have made the bank transfer</p>
                        <p className="text-xs text-gray-500 mt-0.5">Your order will be confirmed once we verify the payment.</p>
                      </div>
                    </label>
                    {errors.bankConfirm && (
                      <p className="text-xs text-red-500 flex items-center gap-1 -mt-2">
                        <AlertCircle className="w-3 h-3" /> {errors.bankConfirm}
                      </p>
                    )}
                  </div>
                )}

                {/* PayFast Info */}
                {paymentMethod === 'payfast' && (
                  <div className="animate-fade-in-up">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm font-medium text-blue-900 flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4" />
                        PayFast Secure Payment
                      </p>
                      <p className="text-xs text-blue-700 mb-3">
                        You'll be redirected to PayFast's secure payment page where you can pay with:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['Credit Card', 'Debit Card', 'EFT (Instant)', 'SnapScan', 'S-code', 'Mobicred'].map(method => (
                          <div key={method} className="bg-white rounded-lg px-3 py-2 text-xs text-gray-700 font-medium border border-blue-100 text-center">
                            {method}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-blue-600 mt-3 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> 256-bit SSL encrypted · PCI DSS compliant
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all transform active:scale-[0.99] ${
                    isProcessing ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-xl btn-shine'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="spinner border-white border-t-transparent" />
                      {paymentMethod === 'payfast' ? 'Redirecting to PayFast...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      {paymentMethod === 'payfast' ? `Pay $${cartTotal.toFixed(2)} via PayFast` : `Place Order — $${cartTotal.toFixed(2)}`}
                      {paymentMethod === 'payfast' ? <ExternalLink className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </>
                  )}
                </button>
                <p className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Your payment information is secure and encrypted
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};
