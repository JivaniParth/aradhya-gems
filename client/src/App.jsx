import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Components
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/auth/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ShippingReturnsPage from './pages/ShippingReturnsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Protected Pages
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import AdminSettings from './pages/admin/AdminSettings';

import { useAuthStore } from './store/useAuthStore';

function App() {
  const { refreshUser, isAuthenticated } = useAuthStore();

  // Re-validate stored JWT and refresh user data on every app load/tab reopen
  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="shipping-returns" element={<ShippingReturnsPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          
          {/* Protected Customer Routes */}
          <Route path="checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="order-confirmation" element={
            <ProtectedRoute>
              <OrderConfirmationPage />
            </ProtectedRoute>
          } />
          <Route path="account" element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Auth Routes (Guest Only) */}
        <Route path="/login" element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        } />
        <Route path="/forgot-password" element={
          <GuestRoute>
            <ForgotPasswordPage />
          </GuestRoute>
        } />
        <Route path="/reset-password/:token" element={
          <GuestRoute>
            <ResetPasswordPage />
          </GuestRoute>
        } />


        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
