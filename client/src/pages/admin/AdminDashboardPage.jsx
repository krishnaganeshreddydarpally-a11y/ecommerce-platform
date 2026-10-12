import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FolderTree,
  BarChart3,
  Flame,
  Award,
} from 'lucide-react';
import { api } from '../../services/api';

import AdminNav from '../../components/AdminNav';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    api.getAdminStats()
      .then((res) => setStats(res.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-28 bg-white rounded-3xl border border-slate-200" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Compute maximum revenue in timeline for chart scaling
  const maxTimelineRevenue = Math.max(
    ...((stats.salesTimeline || []).map((t) => t.revenue) || [100]),
    100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Admin Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck size={16} />
            <span>Store Operations Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Administrator Dashboard
          </h1>
        </div>

        <AdminNav />
      </div>


      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">${stats.totalRevenue.toFixed(2)}</div>
          <p className="text-[11px] text-slate-400">
            Avg Order Value: <strong className="text-slate-700">${stats.averageOrderValue?.toFixed(2) || '0.00'}</strong>
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalOrders}</div>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center space-x-1">
            <TrendingUp size={14} />
            <span>Fulfilled & Pending</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
            <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalProducts}</div>
          <p className="text-[11px] text-slate-400">
            In {stats.totalCategories || 0} active departments
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Users</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalUsers}</div>
          <p className="text-[11px] text-slate-400">Customer & Admin accounts</p>
        </div>
      </div>

      {/* Visual Analytics Section: Sales Timeline Bar Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 7-Day Revenue Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <BarChart3 size={18} className="text-indigo-600" />
                <span>Sales Revenue Trend (7-Day Activity)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily order volume and transaction gross revenue
              </p>
            </div>
            {hoveredDay !== null && stats.salesTimeline && stats.salesTimeline[hoveredDay] && (
              <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md animate-scale-in">
                {stats.salesTimeline[hoveredDay].label}:{' '}
                <span className="text-emerald-400">${stats.salesTimeline[hoveredDay].revenue.toFixed(2)}</span>
                {' '}({stats.salesTimeline[hoveredDay].ordersCount} orders)
              </div>
            )}
          </div>

          {/* Bar Chart Canvas */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
            {(stats.salesTimeline || []).map((point, idx) => {
              const heightPercent = Math.max(10, Math.round((point.revenue / maxTimelineRevenue) * 100));
              const isHovered = hoveredDay === idx;

              return (
                <div
                  key={point.date}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  onMouseEnter={() => setHoveredDay(idx)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <span className="text-[10px] font-bold text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${point.revenue.toFixed(0)}
                  </span>
                  <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-300 ${
                        isHovered
                          ? 'bg-indigo-500 shadow-lg shadow-indigo-200'
                          : point.revenue > 0
                          ? 'bg-indigo-600'
                          : 'bg-slate-200'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 mt-2 truncate w-full text-center">
                    {point.label.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Past 7 Days Tracking</span>
            <span>Scale Ceiling: ${maxTimelineRevenue.toFixed(2)}</span>
          </div>
        </div>

        {/* Category Revenue Distribution */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <FolderTree size={18} className="text-indigo-600" />
              <span>Category Distribution</span>
            </h2>
            <Link
              to="/admin/categories"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center space-x-1"
            >
              <span>Manage</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {(stats.categoryDistribution || []).map((cat) => {
              const maxCatRev = Math.max(...(stats.categoryDistribution.map((c) => c.revenue) || [1]), 1);
              const barWidth = Math.max(5, Math.round((cat.revenue / maxCatRev) * 100));

              return (
                <div key={cat.id} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800">{cat.name}</span>
                    <span className="text-slate-900">${cat.revenue.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{cat.productCount} active products</span>
                    <span>{cat.unitsSold} sold</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Selling Products Leaderboard & Order Status Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products Leaderboard */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Award size={18} className="text-amber-500" />
              <span>Top Performing Products</span>
            </h2>
            <Link
              to="/admin/products"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center space-x-1"
            >
              <span>Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {stats.topSellingProducts && stats.topSellingProducts.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {stats.topSellingProducts.map((p, idx) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-[11px]">
                      #{idx + 1}
                    </div>
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                    />
                    <div>
                      <p className="font-bold text-slate-800 truncate max-w-[200px]">{p.name}</p>
                      <p className="text-slate-400">{p.unitsSold} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900 block text-sm">
                      ${p.revenue.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Total sales</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 italic text-center">
              New customer orders will populate the sales leaderboard.
            </p>
          )}
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <AlertTriangle size={18} className="text-amber-500" />
              <span>Low Stock Alerts (&lt; 20 units)</span>
            </h2>
            <Link
              to="/admin/products"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center space-x-1"
            >
              <span>Restock</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 italic">All inventory levels are healthy!</p>
            ) : (
              stats.lowStockProducts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img
                      src={p.images ? p.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                    />
                    <div>
                      <p className="font-bold text-slate-800 truncate max-w-[200px]">{p.name}</p>
                      <p className="text-slate-400">{p.categoryName}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {p.stock} in stock
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
