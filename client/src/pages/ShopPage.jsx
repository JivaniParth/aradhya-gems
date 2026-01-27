import React from 'react';
import ProductCard from '../components/shop/ProductCard';
import { products } from '../data/products';

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
           <h1 className="text-4xl font-serif text-secondary mb-2">All Collections</h1>
           <p className="text-muted-foreground">Browse our entire catalogue of fine jewellery.</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
            <select className="bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
