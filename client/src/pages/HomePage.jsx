import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import ProductCard from '../components/shop/ProductCard';
import { WhyBuyFromUs, TrustStrip } from '../components/common/TrustComponents';
import HeroCarousel from '../components/common/HeroCarousel';
import { productAPI, categoryAPI } from '../services/api';
import {
  categories,
  occasions
} from '../data/constants';

// ========================================
// CAROUSEL COMPONENT (Mobile-First with dots)
// ========================================
function ProductCarousel({ products, title, subtitle, viewAllLink, loading }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.firstChild?.offsetWidth || 280;
    const gap = 24;
    const scrollAmount = (cardWidth + gap) * (direction === 'left' ? -1 : 1);

    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.firstChild?.offsetWidth || 280;
    const gap = 24;
    const index = Math.round(container.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(index, products.length - 1));
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-secondary">{title}</h2>
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {!loading && products.length > 0 && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Carousel */}
        {!loading && products.length > 0 && (
          <>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex-shrink-0 w-[70%] sm:w-[45%] md:w-[30%] lg:w-[23%] snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Dot Indicators (Mobile) */}
            <div className="flex justify-center gap-1.5 mt-4 md:hidden">
              {products.slice(0, Math.min(products.length, 8)).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${index === activeIndex ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  onClick={() => {
                    const container = scrollRef.current;
                    if (!container) return;
                    const cardWidth = container.firstChild?.offsetWidth || 280;
                    const gap = 16;
                    container.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* View All Link */}
        {viewAllLink && !loading && products.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to={viewAllLink}
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// ========================================
// CATEGORY SECTION (Nova Jewels-inspired circular cards)
// ========================================
function CategorySection() {
  const [apiCategories, setApiCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await categoryAPI.getHierarchy();
        setApiCategories(data.data.categories || []);
      } catch {
        setApiCategories([]);
      }
    };
    fetchCats();
  }, []);

  // Use API parent categories or fallback to constants
  const displayCategories = apiCategories.length > 0 ? apiCategories : categories;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white via-accent/20 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-secondary text-center mb-3">
          Shop by Category
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-md mx-auto">
          Explore our curated collections crafted for every occasion
        </p>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {displayCategories.map((category) => (
            <Link
              key={category._id || category.id}
              to={`/shop/${category.slug}`}
              className="group flex flex-col items-center gap-3 w-28 md:w-36"
            >
              {/* Circular image */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden
                                border-[3px] border-white shadow-lg
                                group-hover:shadow-xl group-hover:shadow-primary/15
                                transition-all duration-500 ease-out
                                group-hover:scale-105">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <span className="text-3xl font-serif text-primary/60">{category.name[0]}</span>
                    </div>
                  )}
                </div>
                {/* Subtle ring on hover */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent
                                group-hover:border-primary/30 transition-colors duration-300
                                scale-110 pointer-events-none" />
              </div>

              {/* Name */}
              <span className="text-sm md:text-base font-medium text-secondary
                               text-center leading-tight group-hover:text-primary
                               transition-colors duration-300">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


// ========================================
// OCCASION STRIP (Emotional navigation)
// ========================================



// Custom SVG icons for each occasion (replaces emojis)
const occasionIcons = {
  'daily-wear': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ),
  'wedding': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      <path d="M12 5.67V12" />
    </svg>
  ),
  'anniversary': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  'gifting': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M12 8v13" />
      <path d="M3 12h18" />
      <path d="M12 8c-2-3-6-3.5-6-1s4 3 6 1" />
      <path d="M12 8c2-3 6-3.5 6-1s-4 3-6 1" />
    </svg>
  ),
  'office-wear': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <circle cx="12" cy="14" r="0.5" fill="currentColor" />
    </svg>
  ),
  'party': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      <circle cx="5" cy="5" r="1" fill="currentColor" />
      <circle cx="20" cy="4" r="1" fill="currentColor" />
    </svg>
  )
};

function OccasionStrip() {
  return (
    <section
      className="py-10 md:py-14 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fdf8f0 0%, #fef6e8 50%, #fdf0e0 100%)' }}
    >
      {/* Decorative shimmer overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.1) 0%, transparent 50%)'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <p className="text-center text-sm md:text-base font-serif font-semibold text-secondary uppercase tracking-[0.2em] mb-8 md:mb-10">
          Shopping for an Occasion?
        </p>

        <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
          {occasions.map((occasion) => (
            <Link
              key={occasion.id}
              to={`/shop?occasion=${occasion.id}`}
              className="group relative flex flex-col items-center gap-3 p-4 md:p-5 rounded-2xl
                         bg-white/80 backdrop-blur-sm border border-amber-100/60
                         hover:bg-white hover:border-amber-200
                         hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)]
                         transition-all duration-300 ease-out
                         hover:-translate-y-1 min-w-[90px] md:min-w-[110px]"
            >
              {/* Icon with gold gradient ring */}
              <div
                className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center
                            rounded-full bg-gradient-to-br from-amber-50 to-amber-100
                            border border-amber-200/50
                            group-hover:from-amber-100 group-hover:to-amber-200/60
                            group-hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]
                            transition-all duration-300"
              >
                <span className="text-amber-700 group-hover:text-amber-800 transition-colors duration-300">
                  {occasionIcons[occasion.id]}
                </span>
              </div>

              {/* Name */}
              <span className="text-xs md:text-sm font-semibold text-secondary tracking-wide">
                {occasion.name}
              </span>

              {/* Hover tooltip description */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2
                              opacity-0 group-hover:opacity-100 group-hover:-bottom-9
                              transition-all duration-300 pointer-events-none z-20
                              whitespace-nowrap">
                <div className="bg-secondary text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg relative">
                  {occasion.description}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-secondary rotate-45" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}



// ========================================
// QUICK ACTIONS - Decision shortcuts
// ========================================
function QuickActions() {
  const actions = [
    {
      title: 'Daily Wear Under ₹25K',
      description: 'Lightweight pieces for everyday elegance',
      link: '/shop?occasion=daily-wear&maxPrice=25000',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop'
    },
    {
      title: 'Gift Ready Pieces',
      description: 'Beautiful boxes, ready to surprise',
      link: '/shop?occasion=gifting',
      image: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=400&auto=format&fit=crop'
    },
    {
      title: 'Wedding Collection',
      description: 'For the most special day',
      link: '/shop?occasion=wedding',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&auto=format&fit=crop'
    }
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-secondary text-center mb-8">
          Quick Shop
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {actions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group relative h-48 md:h-64 rounded-lg overflow-hidden"
            >
              <img
                src={action.image}
                alt={action.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                <h3 className="text-xl md:text-2xl font-serif font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-white/80">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================================
// MAIN HOMEPAGE COMPONENT
// ========================================
export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await productAPI.getFeatured();
        setNewArrivals(data.data.newArrivals || []);
        setBestSellers(data.data.bestSellers || []);
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Trust Strip - Above the fold */}
      <TrustStrip />

      {/* Hero Carousel - Dynamic sliding banner */}
      <HeroCarousel />

      {/* New Arrivals - For repeat users */}
      <ProductCarousel
        products={newArrivals}
        title="New Arrivals"
        subtitle="The latest additions to our collection"
        viewAllLink="/shop?sort=newest"
        loading={loading}
      />

      {/* Occasion Navigation - Emotional path */}
      <OccasionStrip />

      {/* Category Section - Circular cards */}
      <CategorySection />

      {/* Best Sellers - Social proof */}
      <ProductCarousel
        products={bestSellers}
        title="Best Sellers"
        subtitle="Most loved by our customers"
        viewAllLink="/shop?sort=popular"
        loading={loading}
      />

      {/* Quick Actions - Decision shortcuts */}
      <QuickActions />

      {/* Why Buy From Us - Trust for new users */}
      <WhyBuyFromUs />

      {/* Final CTA */}
      <section className="py-16 bg-secondary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-6">
            Our jewelry experts are here to help. Get personalized recommendations
            based on your occasion, budget, and style preferences.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact">
              <Button>Chat with Expert</Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                Browse Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
