import React from 'react';
import { Link } from 'react-router-dom';
import { User, Package, MapPin, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const { getUserOrders } = useOrderStore();
  
  const userOrders = user ? getUserOrders(user.id) : [];

  const menuItems = [
    { icon: User, label: 'Profile Details', href: '/account/profile' },
    { icon: Package, label: 'Order History', href: '/account/orders' },
    { icon: MapPin, label: 'Saved Addresses', href: '/account/addresses' },
    { icon: CreditCard, label: 'Payment Methods', href: '/account/payments' },
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
            <CardContent className="p-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-gray-400" />
                    <span className="text-secondary">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
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
        <div className="lg:col-span-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link to="/account/orders" className="text-sm text-primary hover:text-primary-hover">
                View All
              </Link>
            </CardHeader>
            <CardContent>
              {userOrders.length > 0 ? (
                <div className="space-y-4">
                  {userOrders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-secondary">{order.id}</p>
                        <p className="text-sm text-gray-500">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''} • {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toLocaleString()}</p>
                        <Badge variant={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                  <Link to="/shop">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
