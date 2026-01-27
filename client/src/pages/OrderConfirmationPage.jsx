import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order || {
    id: 'ORD-XXXXXXXX',
    total: 0,
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        {/* Confirmation Message */}
        <h1 className="text-4xl font-serif font-bold text-secondary mb-4">
          Order Confirmed!
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Thank you for your purchase.
        </p>
        <p className="text-gray-500 mb-8">
          Your order <span className="font-medium text-secondary">{order.id}</span> has been placed successfully.
        </p>

        {/* Order Summary Card */}
        <div className="bg-accent/30 rounded-xl p-6 mb-8 text-left">
          <h2 className="font-serif font-semibold text-lg text-secondary mb-4">What's Next?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-secondary">Order Processing</p>
                <p className="text-sm text-gray-500">We're preparing your order for shipment. You'll receive an email confirmation shortly.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-secondary">Free Shipping</p>
                <p className="text-sm text-gray-500">Your order includes complimentary insured shipping. Expected delivery: 5-7 business days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl border p-6 mb-8">
          <p className="text-gray-600 mb-2">
            A confirmation email has been sent to your registered email address.
          </p>
          <p className="text-sm text-gray-500">
            Questions? Contact us at{' '}
            <a href="mailto:support@aradhyagems.com" className="text-primary hover:text-primary-hover">
              support@aradhyagems.com
            </a>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/shop">
            <Button size="lg" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
