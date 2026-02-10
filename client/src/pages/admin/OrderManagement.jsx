import React, { useState, useEffect } from 'react';
import { Search, Eye, MoreVertical, Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal, ModalBody, ModalFooter } from '../../components/ui/Modal';
import { useOrderStore } from '../../store/useOrderStore';

const ORDER_STATUSES = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusColors = {
  pending: 'warning',
  confirmed: 'default',
  processing: 'default',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'danger',
};

export default function OrderManagement() {
  const { orders, isLoading, fetchAllOrders, updateOrderStatus } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateStatusModal, setUpdateStatusModal] = useState({ open: false, order: null });
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const params = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    fetchAllOrders(params);
  }, [statusFilter]);

  // Client-side search filtering on already fetched orders
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      (order.orderId || '').toLowerCase().includes(searchLower) ||
      (order.user?.firstName || '').toLowerCase().includes(searchLower) ||
      (order.user?.lastName || '').toLowerCase().includes(searchLower) ||
      (order.user?.email || '').toLowerCase().includes(searchLower);
    return matchesSearch;
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

  const handleUpdateStatus = async () => {
    if (!updateStatusModal.order) return;
    const result = await updateOrderStatus(updateStatusModal.order._id, { status: newStatus });
    if (result.success) {
      setUpdateStatusModal({ open: false, order: null });
    }
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

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && (
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
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-secondary">{order.orderId}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{order.user?.firstName} {order.user?.lastName}</p>
                      <p className="text-xs text-gray-500">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 font-medium">₹{(order.total || 0).toLocaleString()}</td>
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
      )}

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.orderId}`}
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
                  <p>{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-medium text-secondary mb-2">Shipping Address</h3>
                  <p className="text-gray-600">
                    {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city},
                    {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}
                  </p>
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
                        <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                    <div className="flex justify-between p-3 text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span>₹{(selectedOrder.subtotal || 0).toLocaleString()}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between p-3 text-sm text-green-600">
                        <span>Discount</span>
                        <span>-₹{selectedOrder.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between p-3 text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span>₹{(selectedOrder.tax || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span>{selectedOrder.shippingCost === 0 ? 'Free' : `₹${selectedOrder.shippingCost}`}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 font-medium">
                      <span>Total</span>
                      <span>₹{(selectedOrder.total || 0).toLocaleString()}</span>
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
            Update status for order <strong>{updateStatusModal.order?.orderId}</strong>
          </p>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="out-for-delivery">Out for Delivery</option>
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
