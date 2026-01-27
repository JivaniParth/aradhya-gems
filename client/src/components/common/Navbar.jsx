import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCartStore } from '../../store/useCartStore';

export default function Navbar() {
  const { items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-serif font-bold text-primary">
          Aradhya Gems
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-primary transition-colors">Collections</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-accent rounded-full text-foreground/80">
                <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-accent rounded-full text-foreground/80">
                <User className="w-5 h-5" />
            </button>
            <Link to="/cart" className="p-2 hover:bg-accent rounded-full text-foreground/80 relative">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-[10px] text-white flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
            </Link>
             <button className="md:hidden p-2 hover:bg-accent rounded-full text-foreground/80">
                <Menu className="w-5 h-5" />
            </button>
        </div>
      </div>
    </nav>
  );
}
