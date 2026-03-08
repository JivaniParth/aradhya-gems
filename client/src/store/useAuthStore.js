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
          const needsVerification = err.response?.data?.needsVerification || false;
          const userEmail = err.response?.data?.email || email;
          set({ isLoading: false, error: message });
          return { success: false, error: message, needsVerification, email: userEmail };
        }
      },

      // Register — calls real server API (no auto-login, needs email verification)
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.register(userData);
          set({ isLoading: false, error: null });
          return { success: true, message: data.message, needsVerification: true };
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
        } catch { /* ignore */ }
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
        } catch {
          // Token invalid — log out
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      // Get current user details
      getMe: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.getMe();
          set({ user: data.data, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch {
          set({ isLoading: false, isAuthenticated: false, user: null });
          return { success: false };
        }
      },

      // Update User Profile
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.updateProfile(profileData);
          set((state) => ({
            user: { ...state.user, ...data.data },
            isLoading: false
          }));
          return { success: true, message: 'Profile updated successfully' };
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

      // Set auth state (for email verification auto-login)
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true, error: null });
      },
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
