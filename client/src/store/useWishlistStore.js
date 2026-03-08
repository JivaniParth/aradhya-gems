import { create } from 'zustand';
import { wishlistAPI } from '../services/api';

export const useWishlistStore = create((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  // Fetch wishlist from server (source of truth)
  fetchWishlist: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await wishlistAPI.get();
      set({
        items: data.data.wishlist || [],
        isLoading: false
      });
    } catch {
      // If 401, user not logged in — use empty wishlist
      set({ items: [], isLoading: false });
    }
  },

  // Add item to wishlist (server-backed)
  addItem: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await wishlistAPI.add(productId);
      set({
        items: data.data.wishlist || [],
        isLoading: false
      });
      return true;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to add to wishlist'
      });
      return false;
    }
  },

  // Remove item from wishlist (server-backed)
  removeItem: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await wishlistAPI.remove(productId);
      set({
        items: data.data.wishlist || [],
        isLoading: false
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to remove from wishlist'
      });
    }
  },

  // Toggle item in wishlist
  toggleItem: async (productId) => {
    const inWishlist = get().isInWishlist(productId);
    if (inWishlist) {
      await get().removeItem(productId);
      return false; // Removed
    } else {
      const added = await get().addItem(productId);
      return added; // Added
    }
  },

  // Check if item is in wishlist
  isInWishlist: (productId) => {
    return get().items.some(item => {
      const itemId = item._id || item.id;
      return itemId === productId || String(itemId) === String(productId);
    });
  },

  // Clear all items
  clearWishlist: async () => {
    set({ isLoading: true, error: null });
    try {
      await wishlistAPI.clear();
    } catch { /* ignore */ }
    set({ items: [], isLoading: false });
  },

  // Get count
  getCount: () => {
    return get().items.length;
  },

  clearError: () => set({ error: null })
}));
