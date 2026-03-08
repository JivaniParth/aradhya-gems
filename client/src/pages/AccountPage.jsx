import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, MapPin, CreditCard, LogOut, ChevronRight, Loader2 } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/useAuthStore';
import { orderAPI } from '../services/api';
import { formatPrice } from '../data/constants';
export default function AccountPage() {
  const { user, logout, updateProfile } = useAuthStore();
  const [userOrders, setUserOrders] = useState([]);

  // Profile Edit State
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  });

  // Re-sync form data if user prop updates behind the scenes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const response = await orderAPI.getUserOrders();
          if (response.success) {
            setUserOrders(response.data);
          } else {
            console.error('Failed to fetch user orders:', response.error);
          }
        } catch (error) {
          console.error('Error fetching user orders:', error);
        }
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setProfileMessage({ text: '', type: '' });

    // Validate phone if provided
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      setProfileMessage({ text: 'Please enter a valid phone number with country code.', type: 'error' });
      setIsSaving(false);
      return;
    }

    const result = await updateProfile(formData);

    setIsSaving(false);
    if (result.success) {
      setProfileMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      setTimeout(() => setProfileMessage({ text: '', type: '' }), 3000);
    } else {
      setProfileMessage({ text: result.error || 'Failed to update profile', type: 'error' });
    }
  };

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile Details' },
    { id: 'orders', icon: Package, label: 'Order History' },
    { id: 'addresses', icon: MapPin, label: 'Saved Addresses' },
    { id: 'payments', icon: CreditCard, label: 'Payment Methods' },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const statusColors = {
    pending: 'warning',
    processing: 'default',
    shipped: 'default',
    delivered: 'success',
    cancelled: 'danger',
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold text-secondary mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* User Info Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-serif font-bold text-primary">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <h2 className="font-serif font-semibold text-lg text-secondary">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  {user?.role === 'admin' && (
                    <Badge variant="default" className="mt-1">Admin</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Menu */}
          <Card>
            <CardContent className="p-4 lg:p-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 lg:gap-0 pb-4 lg:pb-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors whitespace-nowrap lg:whitespace-normal ${activeTab === item.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-gray-50 text-secondary'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-primary' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 hidden lg:block ${activeTab === item.id ? 'text-primary' : 'text-gray-400'}`} />
                </button>
              ))}

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 transition-colors text-primary"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5" />
                    <span className="font-medium">Admin Dashboard</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-50 transition-colors text-red-500 mt-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Details</CardTitle>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {profileMessage.text && (
                  <div className={`p-3 mb-4 rounded-md text-sm ${profileMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {profileMessage.text}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={isEditing ? formData.firstName : (user?.firstName || '')}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className={`w-full border rounded-lg px-4 py-2 outline-none transition-colors ${!isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white text-secondary focus:border-primary focus:ring-1 focus:ring-primary'}`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={isEditing ? formData.lastName : (user?.lastName || '')}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className={`w-full border rounded-lg px-4 py-2 outline-none transition-colors ${!isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white text-secondary focus:border-primary focus:ring-1 focus:ring-primary'}`}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      readOnly
                      value={user?.email || ''}
                      className="w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
                      title="Email cannot be changed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {isEditing ? (
                      <PhoneInput
                        international
                        defaultCountry="IN"
                        value={formData.phone}
                        onChange={(value) => setFormData({ ...formData, phone: value })}
                        className={`w-full border rounded-lg px-4 py-2 outline-none transition-colors bg-white text-secondary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary`}
                      />
                    ) : (
                      <input
                        type="tel"
                        readOnly
                        value={user?.phone || 'Not provided'}
                        className="w-full border rounded-lg px-4 py-2 outline-none transition-colors bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                    )}
                  </div>

                  {isEditing && (
                    <div className="pt-4 border-t flex items-center justify-end gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({ firstName: user.firstName, lastName: user.lastName, phone: user.phone });
                        }}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {userOrders.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div
                        key={order._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors gap-4 sm:gap-0"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-secondary hover:text-primary cursor-pointer transition-colors">Order {order.orderId || order._id}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>{formatDate(order.createdAt)}</span>
                          </p>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1">
                          <p className="font-medium">{formatPrice(order.total)}</p>
                          <Badge variant={statusColors[order.status] || 'default'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                    <Link to="/shop">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Saved Addresses</CardTitle>
                <Button size="sm">Add New Address</Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">You haven't saved any addresses yet.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Payment Methods</CardTitle>
                <Button size="sm">Add New Card</Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">You haven't saved any payment methods yet.</p>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
