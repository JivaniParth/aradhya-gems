import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // Import zod
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/useCartStore';

// Define the validation schema
const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Invalid postal code"),
  email: z.string().email("Invalid email address"),
});

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  if (items.length === 0) {
     return <div className="p-20 text-center">Your cart is empty</div>
  }

  const onSubmit = async (data) => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Order Data:', { ...data, items, total });
    clearCart();
    setIsProcessing(false);
    alert("Order Placed Successfully! (Mock)");
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/cart" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-8">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Cart
      </Link>
      
      <h1 className="text-3xl font-serif mb-8 text-secondary">Checkout</h1>

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
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input {...register("address")} className="w-full border rounded-md p-2 focus:ring-primary focus:border-primary" />
                     {errors.address && <span className="text-red-500 text-xs">{errors.address.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <input {...register("city")} className="w-full border rounded-md p-2 focus:ring-primary focus:border-primary" />
                        {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>}
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Postal Code</label>
                        <input {...register("postalCode")} className="w-full border rounded-md p-2 focus:ring-primary focus:border-primary" />
                         {errors.postalCode && <span className="text-red-500 text-xs">{errors.postalCode.message}</span>}
                    </div>
                </div>

                {/* Mock Payment */}
                <div className="border rounded-lg p-4 bg-gray-50 mt-8">
                    <h3 className="font-medium mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" /> 
                        Payment Details
                    </h3>
                    <div className="space-y-3">
                         <input placeholder="Card Number" className="w-full border rounded-md p-2" disabled value="4242 4242 4242 4242" />
                         <div className="grid grid-cols-2 gap-4">
                            <input placeholder="MM/YY" className="w-full border rounded-md p-2" disabled value="12/28" />
                            <input placeholder="CVC" className="w-full border rounded-md p-2" disabled value="123" />
                         </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">This is a mock payment form for design purposes.</p>
                </div>
           </form>
        </div>

        {/* Order Summary */}
        <div>
            <div className="bg-accent/30 p-6 rounded-lg border">
                <h3 className="text-xl font-serif font-bold mb-6">Order Summary</h3>
                 <div className="space-y-4 mb-6">
                    {items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center">
                                <span className="font-medium mr-2">{item.quantity}x</span>
                                <span>{item.name}</span>
                            </div>
                            <span>${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                 </div>
                 <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>${total.toLocaleString()}</span>
                    </div>
                </div>
                <Button 
                    size="lg" 
                    className="w-full" 
                    disabled={isProcessing}
                    onClick={handleSubmit(onSubmit)}
                >
                    {isProcessing ? 'Processing...' : `Pay $${total.toLocaleString()}`}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
