import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login — calls real server API
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.login(email, password);
          const { user, token } = data.data;
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return { success: true, user };
        } catch (err) {
          const message = err.response?.data?.message || 'Login failed';
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      // Register — calls real server API
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.register(userData);
          const { user, token } = data.data;
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return { success: true, user };
        } catch (err) {
          const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      // Logout
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (e) { /* ignore */ }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      // Refresh user data from server
      refreshUser: async () => {
        try {
          const { data } = await authAPI.getMe();
          set({ user: data.data.user });
        } catch (err) {
          // Token invalid — log out
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.updateProfile(profileData);
          set({ user: data.data.user, isLoading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Update failed';
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
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
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
