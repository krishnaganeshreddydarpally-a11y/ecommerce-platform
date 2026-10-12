import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Package, DollarSign, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.name) setName(user.name);
    api.getMyOrders().then((res) => setOrders(res.orders || [])).catch(console.error);
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');
    try {
      const res = await api.updateProfile({ name });
      updateUser(res.user);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const totalSpent = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Account Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage your identity and personal preferences</p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
          alt={user.name}
          className="w-24 h-24 rounded-full border-2 border-indigo-100 object-cover bg-slate-50 shadow-md"
        />
        <div className="text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                user.role === 'admin'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {user.role === 'admin' ? 'Administrator' : 'Customer'}
            </span>
          </div>
          <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
            <Mail size={14} />
            <span>{user.email}</span>
          </p>
          <p className="text-xs text-slate-400">
            Account ID: <span className="font-mono">{user.id}</span>
          </p>
        </div>
      </div>

      {/* Account Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Orders Placed</span>
            <p className="text-2xl font-black text-slate-900">{orders.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Lifetime Spend</span>
            <p className="text-2xl font-black text-slate-900">${totalSpent.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
        <h3 className="text-base font-bold text-slate-900">Edit Personal Information</h3>

        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
            <Check size={16} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4 max-w-md text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Read Only)</label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-xs transition-colors disabled:opacity-50"
          >
            {updating ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
