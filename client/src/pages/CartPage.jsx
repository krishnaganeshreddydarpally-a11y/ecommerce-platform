import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, tax, shippingFee, totalPrice } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const freeShippingThreshold = 100;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SAVE10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon. Try "SAVE10"');
    }
  };

  const discountAmount = promoApplied ? Number((subtotal * 0.1).toFixed(2)) : 0;
  const finalTotal = Math.max(0, Number((totalPrice - discountAmount).toFixed(2)));

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-16 px-4 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center">
          <ShoppingBag size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">Your shopping cart is empty</h1>
          <p className="text-sm text-slate-500">
            Looks like you haven't added any products to your bag yet.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all"
        >
          <span>Explore Products</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your selected items before proceeding to checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold hover:underline"
        >
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Progress */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span>
            {subtotal >= freeShippingThreshold ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Check size={14} /> Congratulations! You unlocked Free Express Shipping!
              </span>
            ) : (
              <span className="text-slate-600">
                Add <strong className="text-indigo-600">${(freeShippingThreshold - subtotal).toFixed(2)}</strong> more to unlock Free Express Shipping
              </span>
            )}
          </span>
          <span className="text-slate-500">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center gap-4"
            >
              <img
                src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl border border-slate-100 shrink-0"
              />

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <Link
                  to={`/products/${item.id}`}
                  className="font-bold text-slate-800 hover:text-indigo-600 text-sm sm:text-base line-clamp-1"
                >
                  {item.name}
                </Link>
                <div className="text-xs text-slate-500 mt-0.5">
                  Unit Price: ${Number(item.price).toFixed(2)}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-semibold text-slate-800 min-w-[32px] text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.stock && item.quantity >= item.stock}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 text-sm font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right sm:min-w-[80px]">
                <div className="font-bold text-slate-900 text-base">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount (10%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold text-slate-900">
                <span>Estimated Total</span>
                <span className="text-indigo-600 text-xl">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Coupon code (try SAVE10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 uppercase"
                />
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-[11px] text-rose-500">{promoError}</p>}
              {promoApplied && <p className="text-[11px] text-emerald-600 font-semibold">Coupon SAVE10 applied (-10%)!</p>}
            </form>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-indigo-200 transition-all hover:translate-y-[-1px]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
