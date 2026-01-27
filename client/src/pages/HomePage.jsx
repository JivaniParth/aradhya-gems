import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import ProductCard from '../components/shop/ProductCard';
import { products } from '../data/products';

export default function HomePage() {
  const featuredProducts = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070&auto=format&fit=crop" 
            alt="Luxury Jewellery Background" 
            className="w-full h-full object-cover brightness-[0.6]"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
            Elegance in Every Detail
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-light">
            Discover our curated collection of timeless pieces, crafted to perfection for the modern connoisseur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" className="min-w-[160px]">
                Shop Collection
              </Button>
            </Link>
            <Link to="/about">
                <Button variant="outline" size="lg" className="min-w-[160px] text-white border-white hover:bg-white/20">
                    Our Story
                </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12 text-secondary">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop' },
              { name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop' },
              { name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-ebea240d16be?q=80&w=800&auto=format&fit=crop' }
            ].map((category) => (
              <div key={category.name} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-8 left-0 right-0 text-center z-20">
                     <Button variant="secondary" className="min-w-[140px] shadow-lg">
                        {category.name}
                     </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-secondary mb-2">New Arrivals</h2>
              <p className="text-muted-foreground">The latest additions to our collection.</p>
            </div>
            <Link to="/shop" className="group flex items-center text-primary font-medium hover:text-primary-hover">
              View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
       <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                    <div className="mb-4 flex justify-center text-primary">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-serif mb-2">Authenticity Guaranteed</h3>
                    <p className="text-gray-400">Every piece comes with a certificate of authenticity.</p>
                </div>
                 <div>
                    <div className="mb-4 flex justify-center text-primary">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-serif mb-2">Lifetime Warranty</h3>
                    <p className="text-gray-400">We stand by the quality of our craftsmanship forever.</p>
                </div>
                 <div>
                    <div className="mb-4 flex justify-center text-primary">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-serif mb-2">Free Shipping</h3>
                    <p className="text-gray-400">Complimentary insured shipping on all global orders.</p>
                </div>
            </div>
        </div>
       </section>
    </div>
  );
}
