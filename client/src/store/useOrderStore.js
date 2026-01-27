import { create } from 'zustand';

// Mock orders data for UI demonstration
const mockOrders = [
  {
    id: 'ORD-001',
    userId: '2',
    items: [
      { productId: '1', name: 'Eternal Gold Necklace', quantity: 1, price: 1250 },
      { productId: '6', name: 'Pearl Studs', quantity: 2, price: 220 },
    ],
    total: 1690,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      postalCode: '10001',
    },
    createdAt: '2026-01-20T10:30:00Z',
    updatedAt: '2026-01-25T14:00:00Z',
  },
  {
    id: 'ORD-002',
    userId: '2',
    items: [
      { productId: '3', name: 'Diamond Solitaire Ring', quantity: 1, price: 3400 },
    ],
    total: 3400,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      postalCode: '10001',
    },
    createdAt: '2026-01-26T09:15:00Z',
    updatedAt: '2026-01-26T09:15:00Z',
  },
];

export const useOrderStore = create((set, get) => ({
  orders: mockOrders,
  currentOrder: null,
  isLoading: false,
  error: null,

  // Create a new order
  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newOrder = {
      id: `ORD-${String(get().orders.length + 1).padStart(3, '0')}`,
      ...orderData,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set(state => ({
      orders: [...state.orders, newOrder],
      currentOrder: newOrder,
      isLoading: false,
    }));
    
    return { success: true, order: newOrder };
  },

  // Get orders for a specific user
  getUserOrders: (userId) => {
    return get().orders.filter(order => order.userId === userId);
  },

  // Get all orders (admin)
  getAllOrders: () => {
    return get().orders;
  },

  // Update order status (admin)
  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: true });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      ),
      isLoading: false,
    }));
    
    return { success: true };
  },

  // Get order by ID
  getOrderById: (orderId) => {
    return get().orders.find(order => order.id === orderId);
  },

  // Clear current order
  clearCurrentOrder: () => set({ currentOrder: null }),
}));
