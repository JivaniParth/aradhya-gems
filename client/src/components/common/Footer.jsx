import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Contact Info */}
          <div>
            <h3 className="text-xl font-serif font-bold text-primary mb-4">Aradhya Gems</h3>
            <p className="text-sm text-gray-400 mb-4">
              Exquisite jewellery for those who appreciate timeless elegance.
            </p>
            <div className="space-y-2">
              <a 
                href="tel:+919924944309" 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                +91 99249 44309
              </a>
              <a 
                href="mailto:aradhyagems13@gmail.com" 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                aradhyagems13@gmail.com
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/shop" className="hover:text-primary transition-colors">
                  All Jewellery
                </Link>
              </li>
              <li>
                <Link to="/shop?sort=newest" className="hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?sort=popular" className="hover:text-primary transition-colors">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="hover:text-primary transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-medium mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/aradhyagems" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-primary rounded-full transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a 
                href="https://facebook.com/aradhyagems" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-primary rounded-full transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Aradhya Gems. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
