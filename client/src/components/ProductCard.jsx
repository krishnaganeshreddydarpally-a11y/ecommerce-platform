import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import RatingStars from './RatingStars';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Product Image & Badges */}
      <Link to={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.images ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            -{discount}%
          </div>
        )}

        {/* Stock status indicator */}
        {product.stock <= 0 ? (
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Out of Stock
          </div>
        ) : product.stock < 10 ? (
          <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-xs text-white text-xs font-medium px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </div>
        ) : null}
      </Link>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wider mb-1">
          {product.categoryName || 'General'}
        </div>

        <Link
          to={`/products/${product.id}`}
          className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5 text-base"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Star Rating */}
        <div className="mb-3">
          <RatingStars rating={product.rating || 5.0} numReviews={product.numReviews} size={14} />
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-xs text-slate-400 line-through">
                ${Number(product.originalPrice).toFixed(2)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex items-center justify-center p-2.5 rounded-xl transition-all font-medium text-sm ${
              added
                ? 'bg-emerald-600 text-white'
                : product.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-indigo-200'
            }`}
            title={product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
          >
            {added ? (
              <Check size={18} className="animate-scale-in" />
            ) : (
              <ShoppingBag size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
