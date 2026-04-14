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
  Settings,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { productAPI, categoryAPI } from '../../services/api';
import { categories as fallbackCategories, occasions, formatPrice } from '../../data/constants';

// Custom SVG icons for each occasion (replaces emojis)
const occasionIcons = {
  'daily-wear': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ),
  'wedding': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      <path d="M12 5.67V12" />
    </svg>
  ),
  'anniversary': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  'gifting': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M12 8v13" />
      <path d="M3 12h18" />
      <path d="M12 8c-2-3-6-3.5-6-1s4 3 6 1" />
      <path d="M12 8c2-3 6-3.5 6-1s-4 3-6 1" />
    </svg>
  ),
  'office-wear': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <circle cx="12" cy="14" r="0.5" fill="currentColor" />
    </svg>
  ),
  'party': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      <circle cx="5" cy="5" r="1" fill="currentColor" />
      <circle cx="20" cy="4" r="1" fill="currentColor" />
    </svg>
  )
};

export default function Navbar() {
  const { items } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);

  // Categories from API
  const [apiCategories, setApiCategories] = useState([]);
  const [expandedMobile, setExpandedMobile] = useState(new Set());
  const [megaMenuOpen, setMegaMenuOpen] = useState(null); // category id for desktop

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Fetch categories from API
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await categoryAPI.getHierarchy();
        setApiCategories(data.data.categories || []);
      } catch {
        // fallback will use constants
        setApiCategories([]);
      }
    };
    fetchCats();
  }, []);

  // Use API categories or fallback
  const navCategories = apiCategories.length > 0 ? apiCategories : fallbackCategories.map(c => ({ ...c, _id: c.id, children: c.children || [] }));

  // Focus search input when opened & fetch trending products
  useEffect(() => {
    if (searchOpen) {
      if (searchInputRef.current) searchInputRef.current.focus();
      // Fetch trending/featured products for "no results" recovery
      if (trendingProducts.length === 0) {
        // Static fallback so "Trending Now" always has content
        const staticFallback = [
          { _id: 'trending-1', name: 'Gold Necklace Set', category: 'Necklaces', price: 45000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&auto=format&fit=crop' },
          { _id: 'trending-2', name: 'Diamond Stud Earrings', category: 'Earrings', price: 32000, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop' },
          { _id: 'trending-3', name: 'Classic Gold Ring', category: 'Rings', price: 18000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop' },
        ];

        productAPI.getFeatured()
          .then(({ data }) => {
            const products = data.data?.products || data.data || [];
            setTrendingProducts(products.length > 0 ? products.slice(0, 3) : staticFallback);
          })
          .catch(() => {
            productAPI.getAll({ sort: 'newest', limit: 3 })
              .then(({ data }) => {
                const products = (data.data?.products || []).slice(0, 3);
                setTrendingProducts(products.length > 0 ? products : staticFallback);
              })
              .catch(() => setTrendingProducts(staticFallback));
          });
      }
    }
  }, [searchOpen]);

  // Search products via API with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.trim()) {
      setSearchLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const { data } = await productAPI.getAll({ search: searchQuery, limit: 5 });
          setSearchResults(data.data.products);
        } catch (err) {
          console.error('Search failed:', err);
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setSearchLoading(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
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
    if (e && e.preventDefault) e.preventDefault();
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

  // Get primary image for search result product
  const getProductImage = (product) => {
    if (product.image) return product.image;
    if (product.media?.length > 0) {
      const primary = product.media.find(m => m.isPrimary);
      return primary?.url || product.media[0]?.url;
    }
    return '';
  };

  // Toggle mobile accordion
  const toggleMobileAccordion = (catId) => {
    setExpandedMobile(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  // Build category link
  const getCategoryLink = (cat, parent) => {
    if (parent) return `/shop/${parent.slug}/${cat.slug}`;
    return `/shop/${cat.slug}`;
  };

  return (
    <>
      {/* Main Navigation - Sticky, Minimal */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="h-14 md:h-16 flex items-center justify-between">

            {/* Left: Menu (Mobile only) */}
            <div className="flex items-center md:hidden" style={{ minWidth: '40px' }}>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 hover:bg-gray-50 rounded-full"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-secondary" />
              </button>
            </div>

            {/* Center: Logo — centered on mobile, left on desktop */}
            <div className="md:flex md:items-center md:gap-8 md:flex-shrink-0">
              {/* Mobile: absolutely centered */}
              <Link
                to="/"
                className="flex items-center gap-2 md:relative absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0"
              >
                <img src="/logo_aradhya.PNG" alt="Aradhya Gems Logo" className="h-7 sm:h-8 md:h-10 object-contain" />
                <span className="hidden md:inline font-serif text-lg sm:text-xl md:text-2xl font-bold text-primary whitespace-nowrap">
                  Aradhya Gems
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
              <Link to="/shop" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                All Jewelry
              </Link>

              {/* Category links with mega menu */}
              {navCategories.map((cat) => (
                <div
                  key={cat._id || cat.id}
                  className="relative group"
                  onMouseEnter={() => cat.children?.length > 0 ? setMegaMenuOpen(cat._id || cat.id) : null}
                  onMouseLeave={() => setMegaMenuOpen(null)}
                >
                  <Link
                    to={getCategoryLink(cat)}
                    className="text-sm font-medium text-secondary hover:text-primary transition-colors flex items-center gap-1 py-4"
                  >
                    {cat.name}
                    {cat.children?.length > 0 && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen === (cat._id || cat.id) ? 'rotate-180' : ''}`} />
                    )}
                  </Link>

                  {/* Mega Menu Flyout */}
                  {cat.children?.length > 0 && megaMenuOpen === (cat._id || cat.id) && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1 z-50">
                      <div className="bg-white rounded-xl border border-gray-100 shadow-2xl p-6 min-w-[400px] max-w-[560px]">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                          <h3 className="font-serif font-semibold text-secondary text-base">
                            {cat.name}
                          </h3>
                          <Link
                            to={getCategoryLink(cat)}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            View All →
                          </Link>
                        </div>

                        {/* Sub-category grid */}
                        <div className="grid grid-cols-3 gap-3">
                          {cat.children.map((sub) => (
                            <Link
                              key={sub._id || sub.id}
                              to={getCategoryLink(sub, cat)}
                              className="group/item flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-primary/5 transition-colors"
                            >
                              {sub.image ? (
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 group-hover/item:border-primary/30 transition-colors">
                                  <img
                                    src={sub.image}
                                    alt={sub.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                                  />
                                </div>
                              ) : (
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border-2 border-gray-100 group-hover/item:border-primary/30 transition-colors">
                                  <span className="text-lg font-serif text-primary">{sub.name[0]}</span>
                                </div>
                              )}
                              <span className="text-xs font-medium text-secondary text-center leading-tight group-hover/item:text-primary transition-colors">
                                {sub.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

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
              <div className="hidden md:block relative z-50">
                {isAuthenticated ? (
                  <Link
                    to="/account"
                    className="p-2 hover:bg-gray-100 rounded-full inline-flex items-center justify-center transition-colors"
                    aria-label="Account"
                    title={user?.firstName ? `${user.firstName}'s Account` : 'My Account'}
                  >
                    <User className="w-5 h-5 text-secondary hover:text-primary transition-colors" />
                  </Link >
                ) : (
                  <Link
                    to="/login"
                    className="text-sm font-medium text-secondary hover:text-primary ml-2"
                  >
                    Sign In
                  </Link>
                )}
              </div >
            </div >
          </div >
        </div >
      </nav >

      {/* Mobile Drawer Menu */}
      {
        mobileMenuOpen && (
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

              {/* Shop by Category — Accordion */}
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

                  {navCategories.map((cat) => {
                    const hasChildren = cat.children && cat.children.length > 0;
                    const isExpanded = expandedMobile.has(cat._id || cat.id);

                    return (
                      <div key={cat._id || cat.id}>
                        <div className="flex items-center">
                          <Link
                            to={getCategoryLink(cat)}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex-1 py-3 px-2 hover:bg-gray-50 rounded-lg font-medium text-secondary"
                          >
                            {cat.name}
                          </Link>
                          {hasChildren && (
                            <button
                              onClick={() => toggleMobileAccordion(cat._id || cat.id)}
                              className="p-2 hover:bg-gray-100 rounded-full"
                            >
                              <ChevronDown
                                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                          )}
                          {!hasChildren && (
                            <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />
                          )}
                        </div>

                        {/* Sub-categories accordion body */}
                        {hasChildren && (
                          <div
                            className="overflow-hidden transition-all duration-300 ease-in-out"
                            style={{
                              maxHeight: isExpanded ? `${cat.children.length * 52}px` : '0',
                              opacity: isExpanded ? 1 : 0
                            }}
                          >
                            <div className="pl-4 border-l-2 border-primary/20 ml-4 mt-1 mb-2">
                              {cat.children.map((sub) => (
                                <Link
                                  key={sub._id || sub.id}
                                  to={getCategoryLink(sub, cat)}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center gap-3 py-2.5 px-2 hover:bg-gray-50 rounded-lg"
                                >
                                  {sub.image ? (
                                    <img src={sub.image} alt={sub.name} className="w-7 h-7 rounded-full object-cover" />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                      <span className="text-xs font-medium text-primary">{sub.name[0]}</span>
                                    </div>
                                  )}
                                  <span className="text-sm text-secondary">{sub.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                      <span className="flex items-center text-secondary">
                        <span className="mr-3 text-primary">{occasionIcons[occasion.id]}</span>
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
        )
      }

      {/* Search Overlay */}
      {
        searchOpen && (
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

                {/* Search Loading */}
                {searchLoading && searchQuery && (
                  <div className="mt-4 pt-4 border-t flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}

                {/* Search Results */}
                {!searchLoading && searchResults.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <div className="space-y-2">
                      {searchResults.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => handleSearchSelect(product._id)}
                          className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg text-left"
                        >
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-secondary truncate">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                          <p className="font-medium text-primary">
                            {formatPrice(product.price)}
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

                {!searchLoading && searchQuery && searchResults.length === 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-muted-foreground text-center mb-1">No results for "{searchQuery}"</p>
                    {trendingProducts.length > 0 && (
                      <>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mt-4 mb-3">Trending Now</p>
                        <div className="space-y-2">
                          {trendingProducts.map((product) => (
                            <button
                              key={product._id}
                              onClick={() => handleSearchSelect(product._id)}
                              className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg text-left transition-colors duration-500"
                            >
                              <img
                                src={getProductImage(product)}
                                alt={product.name}
                                className="w-14 h-14 object-cover rounded-lg"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-secondary truncate">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.category}</p>
                              </div>
                              <p className="font-medium text-primary">
                                {formatPrice(product.price)}
                              </p>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )
      }
    </>
  );
}
