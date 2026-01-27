import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, Shield, ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { products } from '../data/products';
import { useCartStore } from '../store/useCartStore';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif mb-4">Product not found</h2>
        <Link to="/shop">
          <Button variant="outline">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  // Mocking multiple images for the gallery
  const images = [product.image, product.image, product.image];

  const handleAddToCart = () => {
    // Add item quantity times
      for(let i=0; i<quantity; i++) {
        addItem(product);
      }
      // Optional: Show toast
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/shop" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-8">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Collections
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
            <img 
              src={images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square rounded-md overflow-hidden border-2 ${activeImage === idx ? 'border-primary' : 'border-transparent'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <span className="text-primary font-medium tracking-wide uppercase text-sm mb-2 block">{product.category}</span>
          <h1 className="text-4xl font-serif text-secondary mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-6 space-x-4">
            <p className="text-3xl text-secondary font-light">${product.price.toLocaleString()}</p>
             <div className="flex items-center text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <span className="text-gray-400 text-sm ml-2">(12 reviews)</span>
             </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description} Crafted with precision and care, this piece embodies the essence of luxury. 
            Perfect for adding a touch of sophistication to any ensemble.
          </p>

          <div className="space-y-6 mb-8 border-t border-b py-6 border-gray-100">
             <div className="flex items-center justify-between">
                <span className="font-medium text-secondary">Quantity</span>
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                     <button 
                         onClick={() => setQuantity(quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
             </div>
          </div>

          <div className="flex space-x-4 mb-8">
            <Button onClick={handleAddToCart} size="lg" className="flex-1 text-lg">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
            </Button>
            <Button variant="outline" size="lg" className="aspect-square p-0 w-14">
                 <svg className="w-6 h-6 text-gray-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
            <div className="flex items-center">
                <Truck className="w-4 h-4 mr-2 text-primary" />
                Free Global Shipping
            </div>
            <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-primary" />
                Lifetime Warranty
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
