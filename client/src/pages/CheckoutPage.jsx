import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function CheckoutPage() {
  const { items, subtotal, tax, shippingFee, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62704',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
        <AlertCircle size={40} className="text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
        <ShieldCheck size={40} className="text-indigo-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Sign in to complete order</h2>
        <p className="text-sm text-slate-500">
          Please log in or register so we can link this purchase to your account and track its delivery.
        </p>
        <div className="pt-2 flex flex-col space-y-2">
          <Link
            to="/login?redirect=/checkout"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            Sign In Now
          </Link>
          <Link
            to="/register?redirect=/checkout"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            Create New Account
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderPayload = {
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        shippingAddress: address,
        paymentMethod,
      };

      const res = await api.createOrder(orderPayload);
      clearCart();
      navigate(`/orders/${res.order.id}`);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete your delivery details and choose a payment method
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm flex items-center space-x-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shipping & Payment */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <Truck size={22} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">1. Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={address.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={address.street}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={address.city}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">State / Province</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={address.state}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Postal / ZIP Code</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={address.postalCode}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  required
                  value={address.country}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <CreditCard size={22} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">2. Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Credit Card', label: 'Credit / Debit Card', icon: '💳' },
                { id: 'PayPal', label: 'PayPal Checkout', icon: '🅿️' },
                { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: '💵' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === m.id
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-100'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-2xl mb-2">{m.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{m.label}</p>
                    <p className="text-[10px] text-slate-400">Instant verification</p>
                  </div>
                </button>
              ))}
            </div>

            {paymentMethod === 'Credit Card' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Card Number (Simulated)</label>
                  <input
                    type="text"
                    disabled
                    value="•••• •••• •••• 4242"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-500 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      disabled
                      value="12 / 28"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      disabled
                      value="•••"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-500 font-mono"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  * Test mode active: No actual credit card charge will be made.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Items & Pay */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Review Order ({items.length} items)
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 text-xs">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base text-slate-900">
                <span>Total Due</span>
                <span className="text-indigo-600 text-xl">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
            >
              <CheckCircle2 size={18} />
              <span>{loading ? 'Processing Order...' : `Pay $${totalPrice.toFixed(2)} Now`}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
