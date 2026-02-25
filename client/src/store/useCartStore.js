import { create } from 'zustand';
import { cartAPI, couponAPI } from '../services/api';

export const useCartStore = create((set, get) => ({
  items: [],
  pricing: { subtotal: 0, shippingCost: 0, tax: 0, gstBreakdown: { materialGST: 0, makingGST: 0 }, total: 0, itemCount: 0 },
  coupon: null, // { code, discount, description }
  isOpen: false,
  isLoading: false,
  error: null,

  toggleCart: () => set({ isOpen: !get().isOpen }),

  // Fetch cart from server (source of truth)
  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await cartAPI.get();
      const cart = data.data.cart;
      const pricing = data.data.pricing || {
        subtotal: 0, shippingCost: 0, tax: 0,
        gstBreakdown: { materialGST: 0, makingGST: 0 }, total: 0, itemCount: 0
      };
      set({
        items: cart.items || [],
        pricing,
        isLoading: false
      });
    } catch (err) {
      // If 401, user not logged in — use empty cart
      set({ items: [], pricing: { subtotal: 0, shippingCost: 0, tax: 0, total: 0 }, isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      await cartAPI.addItem(productId, quantity);
      await get().fetchCart();
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to add item'
      });
    }
  },

  removeItem: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      await cartAPI.removeItem(productId);
      await get().fetchCart();
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to remove item'
      });
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity < 1) return;
    set({ isLoading: true, error: null });
    try {
      await cartAPI.updateQuantity(productId, quantity);
      await get().fetchCart();
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to update quantity'
      });
    }
  },

  applyCoupon: async (code) => {
    set({ error: null });
    try {
      const { data } = await couponAPI.validate(code);
      if (data.success) {
        set({ coupon: data.data });
        return { success: true, discount: data.data.discount };
      } else {
        set({ coupon: null });
        return { success: false, message: data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid coupon';
      set({ coupon: null, error: message });
      return { success: false, message };
    }
  },

  removeCoupon: () => set({ coupon: null }),

  clearCart: async () => {
    try {
      await cartAPI.clear();
    } catch (e) { /* ignore */ }
    set({
      items: [],
      pricing: { subtotal: 0, shippingCost: 0, tax: 0, gstBreakdown: { materialGST: 0, makingGST: 0 }, total: 0, itemCount: 0 },
      coupon: null
    });
  },

  // Computed total (from server pricing, with coupon)
  get total() {
    const { pricing, coupon } = get();
    const discount = coupon?.discount || 0;
    return Math.round((pricing.total - discount) * 100) / 100;
  },

  clearError: () => set({ error: null })
}));
