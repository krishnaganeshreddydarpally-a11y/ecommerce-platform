import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  ChevronRight,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(null);

  // Review form states
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getProductById(id);
        setProduct(res.product);
        setRelated(res.related || []);
        setSelectedImage(0);
        setQuantity(1);
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setReviewSubmitting(true);
    setReviewSuccess('');
    try {
      const res = await api.addReview(product.id, {
        rating: ratingInput,
        comment: commentInput.trim(),
      });
      setProduct(res.product);
      setCommentInput('');
      setReviewSuccess('Thank you! Your review was successfully posted.');
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-96 bg-white rounded-3xl max-w-4xl mx-auto border border-slate-200" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
        <AlertCircle size={44} className="text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'This item may have been removed.'}</p>
        <Link
          to="/products"
          className="inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-indigo-600">Catalog</Link>
        <ChevronRight size={14} />
        <span className="text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
        {/* Images Column */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center relative">
            <img
              src={product.images ? product.images[selectedImage] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {discount && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Thumbnail row */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              {product.categoryName || 'General Product'}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-3">
              <RatingStars rating={product.rating || 5} numReviews={product.numReviews} size={18} />
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-medium text-emerald-600 flex items-center space-x-1">
                <Check size={14} />
                <span>Verified Authentic</span>
              </span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline space-x-3 pt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-slate-400 line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div>
              {product.stock > 0 ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Action Row */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-4">
              {/* Quantity stepper */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || product.stock <= 0}
                  className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-200 text-sm font-bold transition-colors disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-4 py-2.5 text-sm font-semibold text-slate-800 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || product.stock <= 0}
                  className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-200 text-sm font-bold transition-colors disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Add to cart button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-bold text-sm shadow-md transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : product.stock <= 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:translate-y-[-1px]'
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Shopping Cart'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Value props */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-center border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              <div className="flex flex-col items-center space-y-1">
                <Truck size={16} className="text-indigo-600" />
                <span>Fast Express Shipping</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <ShieldCheck size={16} className="text-indigo-600" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RotateCcw size={16} className="text-indigo-600" />
                <span>Free 30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-500">{key}</span>
                <span className="font-semibold text-slate-800 text-right">{val}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <MessageSquare size={20} className="text-indigo-600" />
              <span>Customer Reviews</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Feedback from verified purchasers
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <span className="text-2xl font-black text-slate-800">{(product.rating || 5).toFixed(1)}</span>
            <div>
              <RatingStars rating={product.rating || 5} size={14} showScore={false} />
              <span className="text-[11px] text-slate-500">{product.numReviews || 0} customer reviews</span>
            </div>
          </div>
        </div>

        {/* Write a Review */}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Leave a Product Review</h3>
            {reviewSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                {reviewSuccess}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Your Rating</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRatingInput(starVal)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={20}
                      className={starVal <= ratingInput ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">{ratingInput} of 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Review Comments</label>
              <textarea
                rows={3}
                placeholder="Share your experience with build quality, battery life, design..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                required
                className="w-full bg-white p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={reviewSubmitting || !commentInput.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-xs disabled:opacity-50"
            >
              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-600">Want to write a review? Please sign in first.</span>
            <Link to="/login" className="text-xs font-bold text-indigo-600 hover:underline">
              Sign In to Review →
            </Link>
          </div>
        )}

        {/* Existing Reviews List */}
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                      {rev.userName ? rev.userName[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                      <div className="flex items-center space-x-1">
                        <RatingStars rating={rev.rating} size={12} showScore={false} />
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 pl-10 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review this product!</p>
        )}
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Similar Products You Might Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
