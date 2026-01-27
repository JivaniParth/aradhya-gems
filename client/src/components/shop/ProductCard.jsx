import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '../ui/Button';

export default function ProductCard({ product }) {
  return (
    <div className="group relative bg-white border border-gray-100/50 rounded-lg overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
      {/* Image Container */}
      <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
        <Link to={`/product/${product.id}`}>
             <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
        </Link>
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-secondary text-primary text-[10px] uppercase font-bold px-2 py-1 tracking-wider">
            New Arrival
          </span>
        )}
        
        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 flex justify-center">
            <Button size="sm" className="w-full">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
            </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{product.category}</p>
        <Link to={`/product/${product.id}`}>
            <h3 className="font-serif text-lg font-medium text-secondary group-hover:text-primary transition-colors">
            {product.name}
            </h3>
        </Link>
        <p className="mt-2 font-medium text-secondary">
          ${product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
