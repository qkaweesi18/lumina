import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ChevronLeft, ShoppingBag, Star, User, Truck, Shield, RefreshCw, Share2, Heart } from 'lucide-react';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, addReview } = useShop();

  const product = products.find(p => p.id === id);

  // Review Form State
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Scroll to top on mount
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

    // Reset form
    setNewName('');
    setNewComment('');
    setNewRating(5);
    setIsReviewFormOpen(false);
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            onClick={() => interactive && setNewRating(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb / Back */}
        <nav className="flex mb-8 animate-fade-in-down">
          <Link to="/" className="text-gray-500 hover:text-black flex items-center text-sm font-medium transition-colors group">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Shop
          </Link>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
          {/* Image Section */}
          <div className="mb-10 lg:mb-0 animate-fade-in-up">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm group relative img-zoom">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 ${isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:text-red-500'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-md hover:text-blue-600 transition-all duration-300 hover:scale-110">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnails (Simulated for now) */}
            <div className="mt-6 grid grid-cols-4 gap-4">
              {[product.image, product.image, product.image, product.image].map((img, idx) => (
                <button key={idx} className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-black transition-all">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col animate-fade-in-up stagger-1">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-4">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">{product.name}</h1>

              {/* Rating Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-sm font-medium text-gray-900 ml-2">{averageRating.toFixed(1)}</span>
                </div>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <button
                  onClick={() => {
                    setActiveTab('reviews');
                    document.getElementById('tabs')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {product.reviews.length} reviews
                </button>
              </div>

              <p className="text-3xl text-gray-900 font-bold">${product.price.toFixed(2)}</p>
            </div>

            <div className="border-t border-b border-gray-100 py-6 mb-8">
              <p className="text-base text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-6 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full flex items-center justify-center rounded-full border border-transparent px-8 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-[0.98] btn-shine ${isAdded ? 'bg-green-600' : 'bg-black hover:bg-gray-900'
                  }`}
              >
                {isAdded ? (
                  <>
                    <svg className="w-5 h-5 mr-2 success-check" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
                  </>
                )}
              </button>

              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { icon: Truck, text: 'Free Shipping' },
                  { icon: RefreshCw, text: 'Free Returns' },
                  { icon: Shield, text: '2 Year Warranty' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50">
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span className="text-xs font-medium text-gray-600">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div id="tabs" className="mt-24 animate-fade-in-up stagger-2">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {['description', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`${activeTab === tab
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'description' ? (
              <div className="prose prose-sm max-w-none text-gray-600 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Product Details</h3>
                <p className="mb-4">
                  Experience the perfect blend of style and functionality with the {product.name}.
                  Meticulously crafted from premium materials, this item is designed to elevate your daily routine
                  while standing the test of time.
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Premium quality materials</li>
                  <li>Modern, minimalist design</li>
                  <li>Durable construction</li>
                  <li>Ethically sourced and manufactured</li>
                </ul>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-gray-900">Customer Reviews</h3>
                  <button
                    onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
                  >
                    {isReviewFormOpen ? 'Cancel' : 'Write a Review'}
                  </button>
                </div>

                {/* Write Review Form */}
                {isReviewFormOpen && (
                  <div className="bg-gray-50 p-6 rounded-xl mb-10 animate-scale-in">
                    <h4 className="text-base font-semibold text-gray-900 mb-4">Share your experience</h4>
                    <form onSubmit={handleSubmitReview} className="space-y-4 max-w-xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        {renderStars(newRating, true)}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border transition-shadow"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                        <textarea
                          required
                          rows={4}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2.5 border transition-shadow"
                          placeholder="What did you like or dislike?"
                        />
                      </div>

                      <button
                        type="submit"
                        className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none transition-all"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-8">
                  {product.reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <p className="text-gray-500 italic">No reviews yet. Be the first to review this product.</p>
                    </div>
                  ) : (
                    product.reviews.map((review, idx) => (
                      <div
                        key={review.id}
                        className="flex gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors animate-fade-in-up"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-lg font-bold text-gray-400">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-base font-bold text-gray-900">{review.userName}</h4>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                          <div className="mb-3">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
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
  );
};