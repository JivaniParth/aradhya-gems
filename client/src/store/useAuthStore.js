import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock user data for UI demonstration
const mockUsers = [
  {
    id: '1',
    email: 'admin@aradhyagems.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'customer@example.com',
    password: 'customer123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
  },
];

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action - mock implementation for UI
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(
          u => u.email === email && u.password === password
        );
        
        if (user) {
          const { password: _, ...safeUser } = user;
          set({ 
            user: safeUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
          return { success: true, user: safeUser };
        } else {
          set({ 
            isLoading: false, 
            error: 'Invalid email or password' 
          });
          return { success: false, error: 'Invalid email or password' };
        }
      },

      // Register action - mock implementation for UI
      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if email already exists
        const existingUser = mockUsers.find(u => u.email === userData.email);
        if (existingUser) {
          set({ 
            isLoading: false, 
            error: 'Email already registered' 
          });
          return { success: false, error: 'Email already registered' };
        }
        
        // Create new user (mock)
        const newUser = {
          id: String(mockUsers.length + 1),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: 'customer',
        };
        
        set({ 
          user: newUser, 
          isAuthenticated: true, 
          isLoading: false,
          error: null 
        });
        
        return { success: true, user: newUser };
      },

      // Logout action
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      // Update user profile
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...profileData };
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
          return { success: true };
        }
        
        set({ isLoading: false, error: 'No user logged in' });
        return { success: false };
      },

      // Check if user is admin
      isAdmin: () => {
        const user = get().user;
        return user?.role === 'admin';
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
