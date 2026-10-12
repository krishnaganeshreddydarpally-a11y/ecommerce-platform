import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.getMyOrders()
      .then((res) => setOrders(res.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
        <Package size={40} className="text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Please Sign In</h2>
        <p className="text-sm text-slate-500">Sign in to view your order history and tracking status.</p>
        <Link
          to="/login?redirect=/orders"
          className="inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Order History</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your previous purchases, view tracking progress, and invoices
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-3xl border border-slate-200 h-32" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <Package size={32} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">No orders placed yet</h2>
          <p className="text-sm text-slate-500">
            When you purchase items from our catalog, their real-time delivery status will be tracked here.
          </p>
          <Link
            to="/products"
            className="inline-block bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-slate-900 text-base">Order #{order.id}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto py-1">
                  {order.items.map((item, idx) => (
                    <img
                      key={idx}
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                      title={`${item.name} (Qty: ${item.quantity})`}
                    />
                  ))}
                  <span className="text-xs text-slate-500 font-medium pl-2">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="text-xs text-slate-400 block">Total Amount</span>
                  <span className="text-lg font-extrabold text-slate-900">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
                >
                  <span>Track Order</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
