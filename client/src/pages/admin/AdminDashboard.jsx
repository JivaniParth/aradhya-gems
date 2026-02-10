import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { adminAPI } from '../../services/api';

const statusColors = {
  pending: 'warning',
  processing: 'default',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'danger',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminAPI.getStats();
        setDashboardData(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>
      </div>
    );
  }

  const { overview, recentOrders, lowStockProducts, ordersByStatus } = dashboardData;

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${(overview.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      changeType: 'positive',
    },
    {
      title: 'Orders',
      value: String(overview.totalOrders || 0),
      icon: ShoppingBag,
      changeType: 'positive',
    },
    {
      title: 'Products',
      value: String(overview.totalProducts || 0),
      icon: Package,
      changeType: 'positive',
    },
    {
      title: 'Customers',
      value: String(overview.totalUsers || 0),
      icon: Users,
      changeType: 'positive',
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/account')}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Profile</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-secondary">Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time data from your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-secondary">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <stat.icon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Status Breakdown */}
      {ordersByStatus && ordersByStatus.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-serif font-semibold text-secondary mb-4">Orders by Status</h2>
          <div className="flex flex-wrap gap-3">
            {ordersByStatus.map((s) => (
              <div key={s._id} className="px-4 py-2 bg-white border rounded-lg text-sm">
                <Badge variant={statusColors[s._id] || 'default'} className="mr-2">{s._id}</Badge>
                <span className="font-medium">{s.count}</span>
                <span className="text-muted-foreground ml-1">(₹{(s.totalAmount || 0).toLocaleString()})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Link 
              to="/admin/orders" 
              className="text-sm text-primary hover:text-primary-hover flex items-center"
            >
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(recentOrders || []).map((order) => (
                <div 
                  key={order._id} 
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium text-secondary">{order.orderId}</p>
                    <p className="text-sm text-gray-500">
                      {order.user?.firstName} {order.user?.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(order.total || 0).toLocaleString()}</p>
                    <Badge variant={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!recentOrders || recentOrders.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Low Stock Alert</CardTitle>
            <Link 
              to="/admin/products" 
              className="text-sm text-primary hover:text-primary-hover flex items-center"
            >
              Manage <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(lowStockProducts || []).map((product) => (
                  <div 
                    key={product._id} 
                    className="flex items-center gap-4 py-3 border-b last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-secondary truncate">{product.name}</p>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    </div>
                    <Badge variant={product.stock <= 2 ? 'danger' : 'warning'}>
                      {product.stock} left
                    </Badge>
                  </div>
                ))}
              {(!lowStockProducts || lowStockProducts.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">All products well stocked</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-serif font-semibold text-secondary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/admin/products"
            className="p-4 bg-white rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
          >
            <Package className="w-8 h-8 text-primary mx-auto mb-2" />
            <span className="text-sm font-medium">Products</span>
          </Link>
          <Link 
            to="/admin/orders"
            className="p-4 bg-white rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
          >
            <ShoppingBag className="w-8 h-8 text-primary mx-auto mb-2" />
            <span className="text-sm font-medium">Orders</span>
          </Link>
          <Link 
            to="/admin/customers"
            className="p-4 bg-white rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
          >
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <span className="text-sm font-medium">Customers</span>
          </Link>
          <Link 
            to="/admin/settings"
            className="p-4 bg-white rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
          >
            <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
