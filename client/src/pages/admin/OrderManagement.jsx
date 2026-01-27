import React, { useState } from 'react';
import { Search, Eye, MoreVertical } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal, ModalBody, ModalFooter } from '../../components/ui/Modal';

const ORDER_STATUSES = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusColors = {
  pending: 'warning',
  processing: 'default',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'danger',
};

// Mock extended orders data
const mockOrders = [
  {
    id: 'ORD-001',
    customer: { name: 'John Doe', email: 'john@example.com' },
    items: [
      { name: 'Eternal Gold Necklace', quantity: 1, price: 1250 },
      { name: 'Pearl Studs', quantity: 2, price: 220 },
    ],
    total: 1690,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: '123 Main St, New York, NY 10001',
    createdAt: '2026-01-20T10:30:00Z',
  },
  {
    id: 'ORD-002',
    customer: { name: 'Jane Smith', email: 'jane@example.com' },
    items: [
      { name: 'Diamond Solitaire Ring', quantity: 1, price: 3400 },
    ],
    total: 3400,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    createdAt: '2026-01-26T09:15:00Z',
  },
  {
    id: 'ORD-003',
    customer: { name: 'Mike Johnson', email: 'mike@example.com' },
    items: [
      { name: 'Sapphire Drop Earrings', quantity: 1, price: 890 },
    ],
    total: 890,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: '789 Pine Rd, Chicago, IL 60601',
    createdAt: '2026-01-26T14:20:00Z',
  },
  {
    id: 'ORD-004',
    customer: { name: 'Sarah Wilson', email: 'sarah@example.com' },
    items: [
      { name: 'Diamond Eternity Band', quantity: 1, price: 2100 },
    ],
    total: 2100,
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: '321 Elm St, Houston, TX 77001',
    createdAt: '2026-01-27T08:45:00Z',
  },
  {
    id: 'ORD-005',
    customer: { name: 'Tom Brown', email: 'tom@example.com' },
    items: [
      { name: 'Gold Chain Bracelet', quantity: 1, price: 550 },
    ],
    total: 550,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: '654 Maple Dr, Phoenix, AZ 85001',
    createdAt: '2026-01-24T11:30:00Z',
  },
];

export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateStatusModal, setUpdateStatusModal] = useState({ open: false, order: null });
  const [newStatus, setNewStatus] = useState('');

  // Filter orders
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openUpdateStatus = (order) => {
    setNewStatus(order.status);
    setUpdateStatusModal({ open: true, order });
  };

  const handleUpdateStatus = () => {
    // Mock update - in production, this would call the API
    console.log('Updating order', updateStatusModal.order?.id, 'to', newStatus);
    setUpdateStatusModal({ open: false, order: null });
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-secondary">Orders</h1>
        <p className="text-gray-500 mt-1">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search orders by ID, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {ORDER_STATUSES.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Order ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Items</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Payment</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-secondary">{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{order.customer.name}</p>
                      <p className="text-xs text-gray-500">{order.customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 font-medium">${order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-gray-100 rounded-md text-gray-500"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openUpdateStatus(order)}
                        className="p-2 hover:bg-gray-100 rounded-md text-gray-500"
                        title="Update Status"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <>
            <ModalBody>
              <div className="space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Order Status</p>
                    <Badge variant={statusColors[selectedOrder.status]} className="mt-1">
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <Badge variant={selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'} className="mt-1">
                      {selectedOrder.paymentStatus}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="font-medium text-secondary mb-2">Customer</h3>
                  <p>{selectedOrder.customer.name}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.customer.email}</p>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-medium text-secondary mb-2">Shipping Address</h3>
                  <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-medium text-secondary mb-2">Items</h3>
                  <div className="border rounded-lg divide-y">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between p-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                    <div className="flex justify-between p-3 bg-gray-50 font-medium">
                      <span>Total</span>
                      <span>${selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
              <Button onClick={() => {
                setSelectedOrder(null);
                openUpdateStatus(selectedOrder);
              }}>
                Update Status
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={updateStatusModal.open}
        onClose={() => setUpdateStatusModal({ open: false, order: null })}
        title="Update Order Status"
        size="sm"
      >
        <ModalBody>
          <p className="text-gray-600 mb-4">
            Update status for order <strong>{updateStatusModal.order?.id}</strong>
          </p>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setUpdateStatusModal({ open: false, order: null })}>
            Cancel
          </Button>
          <Button onClick={handleUpdateStatus}>
            Update Status
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
