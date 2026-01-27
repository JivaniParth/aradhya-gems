import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  Heart, 
  User, 
  LogOut, 
  ChevronRight,
  Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { products, categories, occasions } from '../../data/products';

export default function Navbar() {
  const { items } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Search products
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.material.toLowerCase().includes(query) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(query))
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleSearchSelect = (productId) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Main Navigation - Sticky, Minimal */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="h-14 md:h-16 flex items-center justify-between">
            {/* Left: Menu (Mobile) + Logo */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 hover:bg-gray-50 rounded-full"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-secondary" />
              </button>
              
              <Link to="/" className="font-serif text-xl md:text-2xl font-bold text-primary">
                Aradhya Gems
              </Link>
            </div>

            {/* Center: Desktop Navigation (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/shop" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                All Jewelry
              </Link>
              <Link to="/shop?category=necklaces" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                Necklaces
              </Link>
              <Link to="/shop?category=earrings" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                Earrings
              </Link>
              <Link to="/shop?category=rings" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                Rings
              </Link>
              <Link to="/about" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                Our Story
              </Link>
            </div>

            {/* Right: Icons - Search, Wishlist, Cart, (Account on desktop) */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-gray-50 rounded-full"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-secondary" />
              </button>
              
              <Link
                to="/wishlist"
                className="p-2 hover:bg-gray-50 rounded-full relative hidden sm:flex"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-secondary" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>
              
              <Link
                to="/cart"
                className="p-2 hover:bg-gray-50 rounded-full relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-secondary" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Desktop Account */}
              <div className="hidden md:block">
                {isAuthenticated ? (
                  <Link
                    to="/account"
                    className="p-2 hover:bg-gray-50 rounded-full"
                    aria-label="Account"
                  >
                    <User className="w-5 h-5 text-secondary" />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="text-sm font-medium text-secondary hover:text-primary ml-2"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 overflow-y-auto md:hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-serif text-xl font-bold text-primary">Aradhya Gems</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-50 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Section */}
            {isAuthenticated ? (
              <div className="p-4 bg-gray-50 border-b">
                <p className="font-medium text-secondary">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border-b flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center text-sm font-medium bg-primary text-white rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center text-sm font-medium border border-gray-300 rounded-lg"
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* Shop by Category */}
            <div className="p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Shop by Category
              </p>
              <div className="space-y-1">
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-secondary">All Jewelry</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/shop?category=${category.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-secondary">{category.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Shop by Occasion */}
            <div className="p-4 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Shop by Occasion
              </p>
              <div className="space-y-1">
                {occasions.slice(0, 4).map((occasion) => (
                  <Link
                    key={occasion.id}
                    to={`/shop?occasion=${occasion.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg"
                  >
                    <span className="text-secondary">
                      <span className="mr-2">{occasion.icon}</span>
                      {occasion.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Account Links */}
            <div className="p-4 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Your Account
              </p>
              <div className="space-y-1">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-2 hover:bg-gray-50 rounded-lg"
                >
                  <Heart className="w-5 h-5 text-gray-500" />
                  <span className="text-secondary">Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      to="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-2 hover:bg-gray-50 rounded-lg"
                    >
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="text-secondary">My Account</span>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-3 px-2 hover:bg-gray-50 rounded-lg"
                      >
                        <Settings className="w-5 h-5 text-gray-500" />
                        <span className="text-primary font-medium">Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 py-3 px-2 hover:bg-gray-50 rounded-lg w-full text-left"
                    >
                      <LogOut className="w-5 h-5 text-gray-500" />
                      <span className="text-secondary">Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Help Links */}
            <div className="p-4 border-t bg-gray-50">
              <div className="space-y-2 text-sm">
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-muted-foreground hover:text-secondary"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-muted-foreground hover:text-secondary"
                >
                  Contact & Support
                </Link>
                <Link
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-muted-foreground hover:text-secondary"
                >
                  FAQs
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setSearchOpen(false)}
          />
          <div className="fixed inset-x-0 top-0 z-50 bg-white shadow-lg">
            <div className="container mx-auto px-4 py-4 max-w-2xl">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jewelry..."
                  className="w-full pl-12 pr-12 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>

              {/* Quick Links */}
              {!searchQuery && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Gold Necklace', 'Diamond Ring', 'Pearl Earrings', 'Bracelet'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-secondary"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <div className="space-y-2">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSearchSelect(product.id)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg text-left"
                      >
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-secondary truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <p className="font-medium text-primary">
                          ₹{product.price.toLocaleString('en-IN')}
                        </p>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full mt-3 py-2.5 text-center text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="mt-4 pt-4 border-t text-center py-8">
                  <p className="text-muted-foreground">No results for "{searchQuery}"</p>
                  <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
