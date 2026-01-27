import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold text-primary mb-4">Aradhya Gems</h3>
            <p className="text-sm text-gray-400">
              Exquisite jewellery for those who appreciate timeless elegance.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary">All Jewellery</a></li>
                <li><a href="#" className="hover:text-primary">New Arrivals</a></li>
                <li><a href="#" className="hover:text-primary">Best Sellers</a></li>
            </ul>
          </div>
           <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-primary">FAQ</a></li>
            </ul>
          </div>
           <div>
            <h4 className="font-medium mb-4">Social</h4>
             <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary">Instagram</a></li>
                <li><a href="#" className="hover:text-primary">Facebook</a></li>
                <li><a href="#" className="hover:text-primary">Pinterest</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Aradhya Gems. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
