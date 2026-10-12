import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, Clock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      {/* Features Banner */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Free Express Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">On orders exceeding $100</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Secure Checkout</h4>
                <p className="text-xs text-slate-400 mt-0.5">256-bit SSL encrypted payments</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">30-Day Hassle-Free Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">Money back satisfaction guarantee</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Curated Premium Gear</h4>
                <p className="text-xs text-slate-400 mt-0.5">Verified authentic tech and lifestyle</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag size={20} />
              </div>
              <span className="text-xl font-black tracking-tight">
                Nexus<span className="text-indigo-400">Store</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Full-stack modern e-commerce platform delivering seamless browsing, secure authentication, real-time order tracking, and comprehensive store administration.
            </p>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  All Catalog
                </Link>
              </li>
              <li>
                <Link to="/products?featured=true" className="hover:text-white transition-colors">
                  Featured Deals
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Categories</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=cat_electronics" className="hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=cat_audio" className="hover:text-white transition-colors">
                  Audio & Sound
                </Link>
              </li>
              <li>
                <Link to="/products?category=cat_wearables" className="hover:text-white transition-colors">
                  Wearables
                </Link>
              </li>
              <li>
                <Link to="/products?category=cat_home" className="hover:text-white transition-colors">
                  Home & Workspace
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Demo Credentials</h5>
            <div className="bg-slate-800/80 p-3.5 rounded-xl text-xs space-y-2 border border-slate-700/60">
              <div>
                <span className="text-indigo-400 font-bold block">Admin Account:</span>
                <span className="text-slate-300">admin@eshop.com</span> / <span className="text-slate-300">admin123</span>
              </div>
              <div className="pt-1 border-t border-slate-700">
                <span className="text-indigo-400 font-bold block">Customer Account:</span>
                <span className="text-slate-300">user@eshop.com</span> / <span className="text-slate-300">user123</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} NexusStore Inc. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Built with React, Express & Node.js</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
