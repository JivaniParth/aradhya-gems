import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import ProductCard from '../components/shop/ProductCard';
import { WhyBuyFromUs, TrustStrip } from '../components/common/TrustComponents';
import HeroCarousel from '../components/common/HeroCarousel';
import { 
  getNewArrivals, 
  getBestSellers, 
  categories, 
  occasions,
  formatPrice 
} from '../data/products';

// ========================================
// CAROUSEL COMPONENT (Mobile-First with dots)
// ========================================
function ProductCarousel({ products, title, subtitle, viewAllLink }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemsPerView = 4; // Desktop
  const totalPages = Math.ceil(products.length / itemsPerView);

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
        </div>

        {/* Carousel */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.map((product) => (
            <div 
              key={product.id}
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
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-primary' : 'bg-gray-300'
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

        {/* View All Link */}
        {viewAllLink && (
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
// CATEGORY GRID (Intent-based navigation)
// ========================================
function CategoryGrid() {
  return (
    <section className="py-12 md:py-16 bg-accent/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-secondary text-center mb-8">
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg md:text-xl font-serif font-semibold">{category.name}</h3>
                <p className="text-xs md:text-sm text-white/80 mt-1 line-clamp-2">{category.description}</p>
              </div>
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
function OccasionStrip() {
  return (
    <section className="py-8 border-y border-gray-100">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-6">
          Shopping for an Occasion?
        </p>
        
        <div className="flex justify-center gap-3 md:gap-6 flex-wrap">
          {occasions.map((occasion) => (
            <Link
              key={occasion.id}
              to={`/shop?occasion=${occasion.id}`}
              className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl md:text-3xl">{occasion.icon}</span>
              <span className="text-xs md:text-sm font-medium text-secondary">{occasion.name}</span>
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
// COMPACT HERO - Not theatrical, functional
// ========================================
function CompactHero() {
  return (
    <section className="relative bg-secondary text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-xl">
          <p className="text-primary font-medium text-sm mb-2">New Arrivals</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
            Timeless Elegance, Transparent Pricing
          </h1>
          <p className="text-gray-300 mb-6">
            BIS Hallmarked gold. Certified diamonds. No hidden charges. 
            Lifetime exchange guaranteed.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/shop">
              <Button size="lg">Shop New Arrivals</Button>
            </Link>
            <Link to="/shop?occasion=gifting">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                Gift Guide
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/3">
        <img
          src="https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=600&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-transparent" />
      </div>
    </section>
  );
}

// ========================================
// MAIN HOMEPAGE COMPONENT
// ========================================
export default function HomePage() {
  const newArrivals = getNewArrivals();
  const bestSellers = getBestSellers();

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
      />
      
      {/* Occasion Navigation - Emotional path */}
      <OccasionStrip />
      
      {/* Category Grid - Rational path */}
      <CategoryGrid />
      
      {/* Best Sellers - Social proof */}
      <ProductCarousel
        products={bestSellers}
        title="Best Sellers"
        subtitle="Most loved by our customers"
        viewAllLink="/shop?sort=popular"
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
