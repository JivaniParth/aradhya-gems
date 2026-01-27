import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add item to wishlist
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);
        
        if (!existingItem) {
          set({
            items: [...items, {
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.image,
              category: product.category,
              material: product.material,
              addedAt: new Date().toISOString(),
            }],
          });
          return true;
        }
        return false;
      },

      // Remove item from wishlist
      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.id !== productId),
        });
      },

      // Toggle item in wishlist
      toggleItem: (product) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);
        
        if (existingItem) {
          get().removeItem(product.id);
          return false; // Removed
        } else {
          get().addItem(product);
          return true; // Added
        }
      },

      // Check if item is in wishlist
      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId);
      },

      // Clear all items
      clearWishlist: () => {
        set({ items: [] });
      },

      // Get count
      getCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'aradhya-wishlist',
    }
  )
);
