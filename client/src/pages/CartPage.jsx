import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/useCartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-serif mb-4">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any exquisite pieces yet.</p>
        <Link to="/shop">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif mb-8 text-secondary">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-4 border rounded-lg bg-background">
              <div className="w-full sm:w-32 aspect-square bg-gray-50 rounded-md overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start">
                        <h3 className="text-lg font-serif font-medium text-secondary hover:text-primary transition-colors">
                            <Link to={`/product/${item.id}`}>{item.name}</Link>
                        </h3>
                        <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                   </div>
                   <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                   <p className="font-medium">${item.price.toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-4 mt-4">
                     <div className="flex items-center border rounded-md">
                        <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-accent"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-accent"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                     </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
            <div className="bg-accent/30 p-6 rounded-lg border sticky top-24">
                <h3 className="text-xl font-serif font-bold mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${total.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-green-600">Free</span>
                    </div>
                </div>
                <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>${total.toLocaleString()}</span>
                    </div>
                </div>
                <Link to="/checkout" className="w-full">
                    <Button size="lg" className="w-full">
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
