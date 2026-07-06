import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import {
  CheckCircle, Copy, Check, Building2, CreditCard, MapPin,
  ArrowLeft, Package, Clock, Mail, Phone, AlertCircle
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useShop();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    const found = orders.find(o => o.id === orderId);
    setOrder(found);
  }, [orderId, orders]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 animate-fade-in">
        <div className="text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-500 mb-8">We couldn't find this order. It may have been placed in a different session.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const orderNumber = order.id.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 pt-20 sm:px-6 lg:px-8">

        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500">Thank you for your purchase. Your order has been received.</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2 shadow-sm">
            <span className="text-sm text-gray-500">Order #</span>
            <span className="font-mono font-bold text-gray-900">{orderNumber}</span>
            <button
              onClick={() => copyToClipboard(orderNumber, 'orderNumber')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {copiedField === 'orderNumber' ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Payment Method Banner */}
        {order.paymentMethod === 'bank-transfer' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-amber-900 text-lg">Awaiting Bank Transfer</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Please transfer <strong className="text-amber-900">${order.total.toFixed(2)}</strong> to the bank account below.
                  Your order will be shipped once payment is confirmed.
                </p>
              </div>
            </div>

            {/* Banking Details */}
            <div className="mt-5 bg-white rounded-xl p-5 border border-amber-100 space-y-3">
              {[
                { label: 'Bank', value: 'Standard Bank' },
                { label: 'Account Holder', value: 'Lumina Store (Pty) Ltd' },
                { label: 'Account Number', value: '1234567890123' },
                { label: 'Branch Code', value: '051001' },
                { label: 'Account Type', value: 'Cheque Account' },
                { label: 'Reference', value: orderNumber },
                { label: 'Amount', value: `$${order.total.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-mono font-semibold ${label === 'Amount' ? 'text-green-600' : 'text-gray-900'}`}>{value}</span>
                    <button
                      onClick={() => copyToClipboard(value, label)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
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
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs text-amber-700">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>Please use your order number as the payment reference so we can match your payment to your order.</p>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <CreditCard className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-blue-900 text-lg">Payment via PayFast</h3>
                <p className="text-sm text-blue-700 mt-1">
                  You chose to pay via PayFast. If you haven't completed the payment yet, please check your email for the PayFast payment link.
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  Payment status: <strong className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}>
                    {order.paymentStatus === 'paid' ? 'Paid ✓' : 'Pending'}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Address */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5" /> Delivery Address
          </h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold text-gray-900">{order.customer.name}</p>
            <p className="text-sm text-gray-600 mt-1">{order.customer.address}</p>
            <p className="text-sm text-gray-600">{order.customer.city}, {order.customer.province} {order.customer.postalCode}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {order.customer.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {order.customer.phone}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Package className="w-5 h-5" /> Order Items
          </h3>
          <ul className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <li key={item.id} className="flex py-4 first:pt-0 last:pb-0">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                </div>
                <div className="ml-4 flex flex-1 flex-col justify-center">
                  <div className="flex justify-between text-sm font-medium text-gray-900">
                    <h4 className="line-clamp-1">{item.name}</h4>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{item.category} · Qty {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 mt-4 pt-4">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4">What happens next?</h3>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Order Received', desc: 'We\'ve received your order and it\'s being processed.' },
              { step: '2', title: order.paymentMethod === 'bank-transfer' ? 'Payment Verification' : 'Payment Processing', desc: order.paymentMethod === 'bank-transfer' ? 'We\'ll verify your bank transfer within 1-2 business days.' : 'Your payment is being processed by PayFast.' },
              { step: '3', title: 'Order Shipped', desc: 'Once payment is confirmed, we\'ll ship your order within 24 hours.' },
              { step: '4', title: 'Delivered', desc: 'You\'ll receive your order at the delivery address above.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {step}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
