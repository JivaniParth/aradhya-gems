import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CreditCard, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { formatPrice } from '../data/constants';

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Invalid postal code"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email address"),
  paymentMethod: z.enum(['cod', 'card', 'upi'], { required_error: "Select a payment method" }),
});

export default function CheckoutPage() {
  const { items, pricing, coupon, fetchCart, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'cod' }
  });

  useEffect(() => {
    fetchCart();
  }, []);

  if (items.length === 0) {
    return <div className="p-20 text-center">Your cart is empty</div>
  }

  const discount = coupon?.discount || 0;
  const finalTotal = Math.round((pricing.total - discount) * 100) / 100;

  const onSubmit = async (data) => {
    setIsProcessing(true);
    setOrderError('');

    const orderPayload = {
      shippingAddress: {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        phone: data.phone
      },
      paymentMethod: data.paymentMethod,
      couponCode: coupon?.code || undefined,
      notes: ''
    };

    const result = await createOrder(orderPayload);
    setIsProcessing(false);

    if (result.success) {
      await clearCart();
      navigate('/order-confirmation', { state: { order: result.order } });
    } else {
      setOrderError(result.error || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/cart" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-8">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-serif mb-8 text-secondary">Checkout</h1>

      {orderError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-red-700 text-sm">{orderError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Form */}
        <div>
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input {...register("firstName")} className="w-full border rounded-md p-2 focus:ring-primary focus:border-primary" />
                {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input {...register("lastName")} className="w-full border rounded-md p-2 focus:ring-primary focus:border-primary" />
                {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input {...register("email")} className="w-full border rounded-md p-2 focus:ring-primary focus:border-primary" />
              {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input {...register("phone")} className="w-full border rounded-md p-2 focus:ring-primary focus:border-primary" />
              {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input {...register("address")} className="w-full border rounded-md p-2 focus:ring-primary focus:border-primary" />
              {errors.address && <span className="text-red-500 text-xs">{errors.address.message}</span>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input {...register("city")} className="w-full border rounded-md p-2 focus:ring-primary focus:border-primary" />
                {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input {...register("state")} className="w-full border rounded-md p-2 focus:ring-primary focus:border-primary" />
                {errors.state && <span className="text-red-500 text-xs">{errors.state.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input {...register("postalCode")} className="w-full border rounded-md p-2 focus:ring-primary focus:border-primary" />
                {errors.postalCode && <span className="text-red-500 text-xs">{errors.postalCode.message}</span>}
              </div>
            </div>

            {/* Payment Method */}
            <div className="border rounded-lg p-4 bg-gray-50 mt-8">
              <h3 className="font-medium mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Method
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-white">
                  <input type="radio" value="cod" {...register("paymentMethod")} className="accent-primary" />
                  <span className="text-sm font-medium">Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-white">
                  <input type="radio" value="upi" {...register("paymentMethod")} className="accent-primary" />
                  <span className="text-sm font-medium">UPI</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-white">
                  <input type="radio" value="card" {...register("paymentMethod")} className="accent-primary" />
                  <span className="text-sm font-medium">Card (Coming Soon)</span>
                </label>
              </div>
              {errors.paymentMethod && <span className="text-red-500 text-xs">{errors.paymentMethod.message}</span>}
              <p className="text-xs text-gray-400 mt-3">Payment gateway integration coming soon. COD available now.</p>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-accent/30 p-6 rounded-lg border">
            <h3 className="text-xl font-serif font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-4">
              {items.map(item => {
                const product = item.product || {};
                return (
                  <div key={product._id || item._id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{item.quantity}x</span>
                      <span>{product.name || item.name}</span>
                    </div>
                    <span>{formatPrice((item.price || product.price || 0) * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{pricing.shippingCost === 0 ? 'Free' : `₹${pricing.shippingCost}`}</span>
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
              {!pricing.gstBreakdown?.materialGST && !pricing.gstBreakdown?.makingGST && pricing.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST</span>
                  <span>{formatPrice(pricing.tax)}</span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon ({coupon.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full"
              disabled={isProcessing}
              onClick={handleSubmit(onSubmit)}
            >
              {isProcessing ? 'Placing Order...' : `Place Order — ₹${finalTotal.toLocaleString()}`}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Final amount is calculated on the server. Prices cannot be manipulated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
