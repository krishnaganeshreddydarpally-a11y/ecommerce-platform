import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Laptop,
  Headphones,
  Watch,
  Home,
  ShoppingBag,
} from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts('featured=true'),
          api.getCategories(),
        ]);
        setFeaturedProducts(prodRes.products || []);
        setCategories(catRes.categories || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop size={22} />;
      case 'Headphones':
        return <Headphones size={22} />;
      case 'Watch':
        return <Watch size={22} />;
      case 'Home':
        return <Home size={22} />;
      default:
        return <ShoppingBag size={22} />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white my-6 mx-4 sm:mx-6 lg:mx-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.25),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-20 lg:py-28 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
              <Sparkles size={14} className="text-amber-400" />
              <span>Next-Generation Online Shopping</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Curated gear for modern living.
            </h1>
            <p className="text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Discover premium audio, intelligent wearables, high-performance workstation hardware, and minimalist lifestyle accessories engineered to elevate your daily routine.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:translate-y-[-1px]"
              >
                <span>Explore Products</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/products?featured=true"
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl backdrop-blur-md transition-colors"
              >
                <span>Featured Deals</span>
              </Link>
            </div>
          </div>

          <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500/30 to-violet-500/10 blur-2xl transform rotate-6" />
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80"
              alt="Hero product"
              className="relative w-full h-full object-cover rounded-3xl shadow-2xl border border-white/10"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Editor's Pick</p>
                <p className="text-sm font-bold text-white">Aura Pro Noise-Cancelling</p>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-emerald-400">$279.99</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Find exactly what you are looking for by department
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all text-center flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                {getCategoryIcon(cat.icon)}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {cat.productCount !== undefined ? `${cat.productCount} items` : 'Explore'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <TrendingUp size={14} />
              <span>Trending Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>See Catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-200 p-4 h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotion Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-indigo-600/10">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Experience the Future of Shopping
            </h3>
            <p className="text-indigo-100 max-w-xl text-sm sm:text-base">
              Instant checkout, simulated zero-risk payment flows, full end-to-end order timeline tracking, and live administrator inventory management.
            </p>
          </div>
          <Link
            to="/products"
            className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-6 py-3.5 rounded-xl shadow-md transition-colors whitespace-nowrap"
          >
            Start Browsing
          </Link>
        </div>
      </section>
    </div>
  );
}
