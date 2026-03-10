import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

const slides = [
  {
    id: 1,
    badge: 'New Arrivals',
    title: 'Timeless Elegance, Transparent Pricing',
    subtitle: 'BIS Hallmarked gold. Certified diamonds. No hidden charges. Lifetime exchange guaranteed.',
    primaryBtn: { text: 'Shop New Arrivals', link: '/shop?sort=newest' },
    secondaryBtn: { text: 'Gift Guide', link: '/shop?occasion=gifting' },
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1920&auto=format&fit=crop'
  },
  {
    id: 2,
    badge: 'Pie Cut Diamond Jewelry',
    title: 'Brilliance You Can Trust',
    subtitle: 'Every diamond comes with international certification. Premium quality at transparent prices.',
    primaryBtn: { text: 'Explore Pie Cut Diamond Jewelry', link: '/shop?category=pie-cut-diamond-jewelry' },
    secondaryBtn: { text: 'Learn More', link: '/about' },
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1920&auto=format&fit=crop'
  },
  {
    id: 3,
    badge: 'Wedding Collection',
    title: 'For Your Perfect Day',
    subtitle: 'Handcrafted bridal jewelry that tells your love story. Custom designs available.',
    primaryBtn: { text: 'View Collection', link: '/shop?occasion=wedding' },
    secondaryBtn: { text: 'Book Consultation', link: '/contact' },
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1920&auto=format&fit=crop'
  },
  {
    id: 4,
    badge: 'Everyday Luxury',
    title: 'Elegance for Every Moment',
    subtitle: 'Lightweight, durable pieces designed for daily wear. Starting from ₹15,000.',
    primaryBtn: { text: 'Shop Daily Wear', link: '/shop?occasion=daily-wear' },
    secondaryBtn: { text: 'Under ₹25K', link: '/shop?maxPrice=25000' },
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1920&auto=format&fit=crop'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide]);

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const slide = slides[currentSlide];

  return (
    <section
      className="relative bg-secondary text-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          key={slide.id}
          src={slide.image}
          alt=""
          className="w-full h-full object-cover transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-16 md:py-20 lg:py-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className="inline-block mb-4 transition-all duration-500 transform"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(-10px)' : 'translateY(0)'
            }}
          >
            <span className="text-primary font-semibold text-sm md:text-base tracking-wide">
              {slide.badge}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold mb-4 md:mb-6 leading-tight transition-all duration-500"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(20px)' : 'translateY(0)'
            }}
          >
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p
            className="text-gray-300 text-base md:text-lg mb-6 md:mb-8 max-w-xl transition-all duration-500 delay-100"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(20px)' : 'translateY(0)'
            }}
          >
            {slide.subtitle}
          </p>

          {/* Buttons */}
          <div
            className="flex flex-wrap gap-3 md:gap-4 transition-all duration-500 delay-150"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(20px)' : 'translateY(0)'
            }}
          >
            <Link to={slide.primaryBtn.link}>
              <Button size="lg" className="text-sm md:text-base">
                {slide.primaryBtn.text}
              </Button>
            </Link>
            <Link to={slide.secondaryBtn.link}>
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white/10 text-sm md:text-base"
              >
                {slide.secondaryBtn.text}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${index === currentSlide
                ? 'w-8 h-2 bg-primary'
                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </section>
  );
}
