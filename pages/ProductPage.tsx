import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ChevronLeft, ShoppingBag, Star, Truck, Shield, RefreshCw, Heart } from 'lucide-react';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, addReview } = useShop();

  const product = products.find(p => p.id === id);

  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Get all images (gallery + main as fallback)
  const allImages = useMemo(() => {
    if (product?.images && product.images.length > 0) {
      return product.images;
    }
    return [product?.image || ''];
  }, [product]);

  const currentImage = allImages[selectedImage] || product?.image;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const averageRating = useMemo(() => {
    if (!product || !product.reviews || product.reviews.length === 0) return 0;
    const total = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / product.reviews.length;
  }, [product]);

  if (!product) {
    return <Navigate to="/" />;
  }

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;
    addReview(product.id, {
      id: Date.now().toString(),
      userName: newName,
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0]
    });
    setNewName('');
    setNewComment('');
    setNewRating(5);
    setIsReviewFormOpen(false);
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            onClick={() => interactive && setNewRating(star)}
            className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          >
            <Star className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 flex flex-col justify-center">
        {/* Back Link */}
        <nav className="mb-4">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2.5 -ml-4 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg text-sm font-medium transition-all group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Shop
          </Link>
        </nav>

        {/* Product Grid — fills available space */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center flex-1">
          {/* Left: Image */}
          <div className="flex flex-col">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
              <img
                src={currentImage}
                alt={product.name}
                className="h-full w-full object-cover transition-all duration-300"
              />
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md transition-all ${isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:text-red-500'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {allImages.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-black shadow-md scale-105'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <span className="text-sm text-gray-400 uppercase tracking-wider font-medium mb-2">
              {product.category}
            </span>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              {renderStars(Math.round(averageRating))}
              <span className="text-base text-gray-600 font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-gray-300">·</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-base text-blue-600 hover:underline font-medium"
              >
                {product.reviews.length} reviews
              </button>
            </div>

            {/* Price */}
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">R{product.price.toFixed(2)}</p>

            {/* Description */}
            <p className="text-base text-gray-600 leading-relaxed mb-6 max-w-lg">{product.description}</p>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`w-full max-w-md flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg text-white transition-all shadow-lg hover:shadow-xl ${
                isAdded ? 'bg-green-600' : 'bg-black hover:bg-gray-800'
              }`}
            >
              {isAdded ? (
                <>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-6 h-6" />
                  Add to Cart
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-5 max-w-md">
              {[
                { icon: Truck, text: 'Free Shipping' },
                { icon: RefreshCw, text: 'Free Returns' },
                { icon: Shield, text: '2 Year Warranty' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-gray-50 border border-gray-100">
                  <item.icon className="w-5 h-5 text-gray-500" />
                  <span className="text-xs font-medium text-gray-500 text-center">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mt-6 border-t border-gray-100 pt-5 max-w-md">
              <div className="flex gap-8 border-b border-gray-100 mb-5">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`pb-2.5 text-sm font-semibold transition-colors ${
                    activeTab === 'description'
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2.5 text-sm font-semibold transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Reviews ({product.reviews.length})
                </button>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === 'description' ? (
                  <div className="text-sm text-gray-600 space-y-3">
                    <p>
                      Experience the perfect blend of style and functionality with the {product.name}.
                      Meticulously crafted from premium materials, designed to elevate your daily routine.
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-gray-500">
                      <li>Premium quality materials</li>
                      <li>Modern, minimalist design</li>
                      <li>Durable construction</li>
                      <li>Ethically sourced</li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-900">Reviews</span>
                      <button
                        onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        {isReviewFormOpen ? 'Cancel' : 'Write a Review'}
                      </button>
                    </div>

                    {isReviewFormOpen && (
                      <form onSubmit={handleSubmitReview} className="bg-gray-50 p-4 rounded-xl mb-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Rating:</span>
                          {renderStars(newRating, true)}
                        </div>
                        <input
                          type="text"
                          required
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full text-sm rounded-lg border-gray-200 p-2.5 border focus:border-black focus:ring-0"
                          placeholder="Your name"
                        />
                        <textarea
                          required
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full text-sm rounded-lg border-gray-200 p-2.5 border focus:border-black focus:ring-0 resize-none"
                          rows={2}
                          placeholder="Your review..."
                        />
                        <button
                          type="submit"
                          className="bg-black text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          Submit Review
                        </button>
                      </form>
                    )}

                    <div className="space-y-4">
                      {product.reviews.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No reviews yet. Be the first!</p>
                      ) : (
                        product.reviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-semibold text-gray-900">{review.userName}</span>
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-sm text-gray-600">{review.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
