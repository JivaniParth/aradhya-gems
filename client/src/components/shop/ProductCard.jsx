import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { formatPrice } from '../../data/constants';

export default function ProductCard({ product, showQuickAdd = true }) {
  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const productId = product._id || product.id;
  const inWishlist = isInWishlist(productId);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(productId);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(productId);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden transition-all hover:shadow-lg border border-gray-100">
      {/* Image Container */}
      <div className="aspect-[4/5] overflow-hidden bg-gray-50 relative">
        <Link to={`/product/${productId}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors z-10 ${inWishlist
              ? 'bg-red-50 text-red-500'
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Badges - Top Left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {(product.isNewArrival || product.isNew) && (
            <span className="text-[10px] font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Best Seller
            </span>
          )}
          {discount > 0 && (
            <span className="text-[10px] font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Stock Badge - Bottom Left */}
        {product.stock <= 3 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2">
            <span className="text-[10px] font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
              Only {product.stock} left
            </span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-medium bg-black/60 px-4 py-2 rounded-full text-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Add Overlay - Desktop Only */}
        {showQuickAdd && product.stock > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0 hidden md:block">
            <Button
              size="sm"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 md:p-4">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">
            {product.category}
          </span>
          {product.reviews && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] md:text-xs text-muted-foreground">
                {product.reviews.average}
              </span>
            </div>
          )}
        </div>

        {/* Product Name */}
        <Link to={`/product/${productId}`}>
          <h3 className="font-serif text-sm md:text-base font-medium text-secondary group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-semibold text-secondary text-sm md:text-base">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Material & Purity */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] md:text-xs text-muted-foreground bg-gray-50 px-2 py-0.5 rounded">
            {product.material}
          </span>
          {product.purity && (
            <span className="text-[10px] md:text-xs text-muted-foreground bg-gray-50 px-2 py-0.5 rounded">
              {product.purity.split('(')[0].trim()}
            </span>
          )}
        </div>

        {/* Mobile Add to Cart */}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="md:hidden w-full mt-3 py-2 text-center text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
