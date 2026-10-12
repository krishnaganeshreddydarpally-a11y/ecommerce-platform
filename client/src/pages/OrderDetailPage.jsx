import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  CreditCard,
  ChevronLeft,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { api } from '../services/api';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await api.getOrderById(id);
      setOrder(res.order);
    } catch (err) {
      setError(err.message || 'Failed to retrieve order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCopyTracking = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await api.cancelOrder(order.id);
      setOrder(res.order);
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 animate-pulse">
        <div className="h-96 bg-white rounded-3xl border border-slate-200" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
        <AlertCircle size={40} className="text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'Could not load order details.'}</p>
        <Link
          to="/orders"
          className="inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const steps = ['Order Placed', 'Payment Confirmed', 'Shipped', 'Delivered'];
  const statusIndexMap = {
    'Processing': 1,
    'Shipped': 2,
    'Delivered': 3,
    'Cancelled': -1,
  };
  const currentStepIndex = statusIndexMap[order.status] ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back to All Orders</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order #{order.id}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {order.status === 'Processing' && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}

          <div
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold border ${
              order.status === 'Delivered'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : order.status === 'Shipped'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : order.status === 'Processing'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {order.status}
          </div>
        </div>
      </div>

      {/* Visual Tracking Progress Stepper (if not cancelled) */}
      {order.status !== 'Cancelled' ? (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Realtime Tracking Status
            </span>
            {order.trackingNumber && (
              <div className="flex items-center space-x-2 text-xs font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-slate-500">Tracking:</span>
                <span className="font-bold text-slate-800">{order.trackingNumber}</span>
                <button
                  onClick={handleCopyTracking}
                  className="text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Copy Tracking Number"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step} className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? 'text-indigo-600 font-bold'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl text-rose-800 text-sm flex items-center space-x-3">
          <AlertCircle size={24} className="shrink-0 text-rose-600" />
          <div>
            <p className="font-bold">This order was cancelled.</p>
            <p className="text-xs text-rose-600 mt-0.5">
              The reserved product units have been returned to inventory.
            </p>
          </div>
        </div>
      )}

      {/* Tracking Timeline Log */}
      {order.timeline && order.timeline.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Activity Timeline
          </h3>
          <div className="space-y-4 border-l-2 border-indigo-100 ml-3 pl-4">
            {order.timeline.map((event, idx) => (
              <div key={idx} className="relative space-y-1">
                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-800">{event.status}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
                {event.note && <p className="text-xs text-slate-500">{event.note}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items & Invoice Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Ordered Items
        </h3>

        <div className="divide-y divide-slate-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover border border-slate-100"
                />
                <div>
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-400">
                    ${Number(item.price).toFixed(2)} × {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-bold text-slate-900">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800">${Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Estimated Tax</span>
            <span className="font-semibold text-slate-800">${Number(order.tax).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Shipping Fee</span>
            <span className="font-semibold text-slate-800">
              {order.shippingFee === 0 ? 'FREE' : `$${Number(order.shippingFee).toFixed(2)}`}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between text-base font-bold text-slate-900">
            <span>Total Paid</span>
            <span className="text-indigo-600 font-extrabold">${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Address & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <MapPin size={16} />
            <span>Shipping Destination</span>
          </div>
          <div className="text-slate-600 text-xs space-y-1">
            <p className="font-bold text-slate-900 text-sm">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.street}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
            </p>
            <p>{order.shippingAddress?.country}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <CreditCard size={16} />
            <span>Payment Summary</span>
          </div>
          <div className="text-slate-600 text-xs space-y-1">
            <p className="font-bold text-slate-900 text-sm">{order.paymentMethod}</p>
            <p>Payment Status: <span className="font-semibold text-emerald-600">{order.paymentStatus}</span></p>
            <p>Receipt sent to: {order.customerEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
