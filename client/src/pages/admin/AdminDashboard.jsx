import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { products } from '../../data/products';

// Mock stats data
const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'positive',
    icon: DollarSign,
  },
  {
    title: 'Orders',
    value: '2,350',
    change: '+180.1%',
    changeType: 'positive',
    icon: ShoppingBag,
  },
  {
    title: 'Products',
    value: products.length.toString(),
    change: '+19%',
    changeType: 'positive',
    icon: Package,
  },
  {
    title: 'Active Customers',
    value: '573',
    change: '-4.5%',
    changeType: 'negative',
    icon: Users,
  },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', total: '$1,690', status: 'delivered', date: 'Jan 25, 2026' },
  { id: 'ORD-002', customer: 'Jane Smith', total: '$3,400', status: 'processing', date: 'Jan 26, 2026' },
  { id: 'ORD-003', customer: 'Mike Johnson', total: '$890', status: 'shipped', date: 'Jan 26, 2026' },
  { id: 'ORD-004', customer: 'Sarah Wilson', total: '$2,100', status: 'pending', date: 'Jan 27, 2026' },
  { id: 'ORD-005', customer: 'Tom Brown', total: '$550', status: 'delivered', date: 'Jan 24, 2026' },
];

const statusColors = {
  pending: 'warning',
  processing: 'default',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'danger',
};

export default function AdminDashboard() {
  const navigate = useNavigate();

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
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
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
                <div className={`p-3 rounded-full ${
                  stat.changeType === 'positive' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <stat.icon className={`w-6 h-6 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              {recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium text-secondary">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total}</p>
                    <Badge variant={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
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
              {products
                .filter(p => p.stock <= 5)
                .slice(0, 5)
                .map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center gap-4 py-3 border-b last:border-0"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-secondary truncate">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <Badge variant={product.stock <= 2 ? 'danger' : 'warning'}>
                      {product.stock} left
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-serif font-semibold text-secondary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/admin/products/new"
            className="p-4 bg-white rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
          >
            <Package className="w-8 h-8 text-primary mx-auto mb-2" />
            <span className="text-sm font-medium">Add Product</span>
          </Link>
          <Link 
            to="/admin/orders"
            className="p-4 bg-white rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
          >
            <ShoppingBag className="w-8 h-8 text-primary mx-auto mb-2" />
            <span className="text-sm font-medium">View Orders</span>
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
            <span className="text-sm font-medium">Sales Report</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
