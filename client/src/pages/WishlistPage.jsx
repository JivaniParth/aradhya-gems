import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../data/constants';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleAddToCart = (item) => {
    // Wishlist items already have product data stored
    if (item && item.stock > 0) {
      addToCart(item);
      removeItem(item.id || item._id);
    }
  };

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      if (item && item.stock > 0) {
        addToCart(item);
      }
    });
    clearWishlist();
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-secondary mb-2">
            Your Wishlist is Empty
          </h1>
          <p className="text-muted-foreground mb-6">
            Save pieces you love by clicking the heart icon on any product. 
            Your wishlist makes it easy to find and buy your favorites later.
          </p>
          <Link to="/shop">
            <Button size="lg">
              Start Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-secondary">
            My Wishlist
          </h1>
          <p className="text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={clearWishlist}>
            Clear All
          </Button>
          <Button size="sm" onClick={handleAddAllToCart}>
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add All to Cart
          </Button>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => {
          const itemId = item._id || item.id;
          const isInStock = item.stock > 0;

          return (
            <div key={itemId} className="bg-white rounded-lg border border-gray-100 overflow-hidden group">
              {/* Image */}
              <Link to={`/product/${itemId}`} className="block">
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {!isInStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-medium bg-black/60 px-4 py-2 rounded-full text-sm">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {item.category}
                </p>
                <Link to={`/product/${itemId}`}>
                  <h3 className="font-serif font-medium text-secondary group-hover:text-primary transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </Link>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-semibold text-secondary">
                    {formatPrice(item.price)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddToCart(item)}
                    disabled={!isInStock}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {isInStock ? 'Add to Cart' : 'Unavailable'}
                  </Button>
                  <button
                    onClick={() => removeItem(itemId)}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-red-200 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Shopping */}
      <div className="text-center mt-12">
        <Link to="/shop" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
