import { create } from 'zustand';
import { orderAPI } from '../services/api';

export const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pagination: null,

  // Create a new order (server-side calculation is the ONLY source of truth)
  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await orderAPI.create(orderData);
      set({
        currentOrder: data.data.order,
        isLoading: false
      });
      return { success: true, order: data.data.order };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create order';
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  // Fetch user's orders
  fetchUserOrders: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await orderAPI.getAll(params);
      set({
        orders: data.data.orders,
        pagination: data.data.pagination,
        isLoading: false
      });
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Failed to fetch orders' });
    }
  },

  // Get single order by ID
  fetchOrderById: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await orderAPI.getById(orderId);
      set({ currentOrder: data.data.order, isLoading: false });
      return data.data.order;
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Order not found' });
      return null;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await orderAPI.cancel(orderId);
      // Update local list
      set(state => ({
        orders: state.orders.map(o =>
          o._id === orderId ? data.data.order : o
        ),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to cancel order';
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  // ── Admin methods ─────────────────────────────
  fetchAllOrders: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await orderAPI.getAllAdmin(params);
      set({
        orders: data.data.orders,
        pagination: data.data.pagination,
        stats: data.data.stats,
        isLoading: false
      });
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Failed to fetch orders' });
    }
  },

  updateOrderStatus: async (orderId, statusData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await orderAPI.updateStatus(orderId, statusData);
      set(state => ({
        orders: state.orders.map(o =>
          o._id === orderId ? data.data.order : o
        ),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update status';
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  clearCurrentOrder: () => set({ currentOrder: null }),
  clearError: () => set({ error: null })
}));
