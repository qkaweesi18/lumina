import React, { useMemo, useState } from 'react';
import { Product } from '../types';
import { Plus, Star, ShoppingBag, Heart, Eye } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useShop();
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const averageRating = useMemo(() => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const total = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / product.reviews.length;
  }, [product.reviews]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-square w-full overflow-hidden bg-gray-100"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${isLiked
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
              }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="p-2.5 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-blue-500 backdrop-blur-md transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick add button overlay - Desktop */}
        <div className="absolute bottom-4 left-4 right-4 hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full py-3 rounded-xl font-medium shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${isAdded
                ? 'bg-green-500 text-white'
                : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
          >
            {isAdded ? (
              <>
                <svg className="w-5 h-5 success-check" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Added!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>

        {/* Sale Badge (optional - for future use) */}
        {/* <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
          SALE
        </div> */}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 space-y-3">
        <div className="flex-1">
          {/* Category & Rating Row */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
              {product.category}
            </span>
            {averageRating > 0 && (
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold text-gray-700">{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
            <Link to={`/product/${product.id}`}>
              {product.name}
            </Link>
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Mobile Add Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-lg font-bold text-gray-900">R{product.price.toFixed(2)}</p>
            <p className="text-xs text-gray-400">Free shipping</p>
          </div>

          {/* Mobile Add Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`md:hidden p-3 rounded-xl transition-all duration-300 active:scale-90 ${isAdded
                ? 'bg-green-500 text-white'
                : 'bg-black text-white hover:bg-gray-800'
              }`}
          >
            {isAdded ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};