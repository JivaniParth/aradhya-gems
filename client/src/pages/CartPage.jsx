import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Tag, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatPrice } from '../data/constants';

export default function CartPage() {
  const { items, pricing, coupon, isLoading, error, fetchCart, removeItem, updateQuantity, applyCoupon, removeCoupon } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    setCouponSuccess('');
    const result = await applyCoupon(couponCode.trim());
    if (result.success) {
      setCouponSuccess(`Coupon applied! You save ${formatPrice(result.discount)}`);
    } else {
      setCouponError(result.message);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-serif mb-4">Please Log In</h2>
        <p className="text-muted-foreground mb-8">You need to be logged in to view your cart.</p>
        <Link to="/login">
          <Button size="lg">Login</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0 && !isLoading) {
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

  const discount = coupon?.discount || 0;
  const finalTotal = Math.round((pricing.total - discount) * 100) / 100;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif mb-8 text-secondary">Shopping Cart</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => {
            const product = item.product || {};
            const productId = product._id || item.product;
            return (
              <div key={productId} className="flex flex-col sm:flex-row gap-6 p-4 border rounded-lg bg-background">
                <div className="w-full sm:w-32 aspect-square bg-gray-50 rounded-md overflow-hidden">
                  <img src={product.image || item.image} alt={product.name || item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-serif font-medium text-secondary hover:text-primary transition-colors">
                        <Link to={`/product/${productId}`}>{product.name || item.name}</Link>
                      </h3>
                      <button
                        onClick={() => removeItem(productId)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="font-medium">{formatPrice(item.price || product.price || 0)}</p>
                    {product.stock !== undefined && product.stock <= 5 && (
                      <p className="text-xs text-orange-500">Only {product.stock} left in stock</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => updateQuantity(productId, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-accent"
                        disabled={isLoading}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(productId, item.quantity + 1)}
                        className="p-2 hover:bg-accent"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Line total: {formatPrice((item.price || 0) * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-accent/30 p-6 rounded-lg border sticky top-24">
            <h3 className="text-xl font-serif font-bold mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className={pricing.shippingCost === 0 ? 'text-green-600' : ''}>
                  {pricing.shippingCost === 0 ? 'Free' : formatPrice(pricing.shippingCost)}
                </span>
              </div>
              {/* India GST Breakdown */}
              {pricing.gstBreakdown?.materialGST > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST on Materials (3%)</span>
                  <span>{formatPrice(pricing.gstBreakdown.materialGST)}</span>
                </div>
              )}
              {pricing.gstBreakdown?.makingGST > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST on Making Charges (5%)</span>
                  <span>{formatPrice(pricing.gstBreakdown.makingGST)}</span>
                </div>
              )}
              {/* Fallback: show single tax line if no breakdown */}
              {!pricing.gstBreakdown?.materialGST && !pricing.gstBreakdown?.makingGST && pricing.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST</span>
                  <span>{formatPrice(pricing.tax)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
            </div>

            {/* Coupon Code */}
            <div className="mb-6">
              {coupon ? (
                <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-700">{coupon.code}</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 border rounded-md px-3 py-2 text-sm"
                    />
                    <Button size="sm" onClick={handleApplyCoupon} disabled={isLoading}>
                      Apply
                    </Button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                  {couponSuccess && <p className="text-xs text-green-600 mt-1">{couponSuccess}</p>}
                </div>
              )}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
              {pricing.shippingCost > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Free shipping on orders above ₹50,000
                </p>
              )}
            </div>
            <Link to="/checkout" className="w-full">
              <Button size="lg" className="w-full" disabled={isLoading}>
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
