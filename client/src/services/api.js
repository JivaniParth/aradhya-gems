import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// ── Request interceptor: attach JWT token ──────────────
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch {
        // Ignore parse errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 ──────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('auth-storage');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════════════════════
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  register: (data) =>
    api.post('/auth/register', data),

  getMe: () =>
    api.get('/auth/me'),

  updateProfile: (data) =>
    api.put('/auth/profile', data),

  updatePassword: (data) =>
    api.put('/auth/password', data),

  addAddress: (data) =>
    api.post('/auth/addresses', data),

  updateAddress: (addressId, data) =>
    api.put(`/auth/addresses/${addressId}`, data),

  deleteAddress: (addressId) =>
    api.delete(`/auth/addresses/${addressId}`),

  logout: () =>
    api.post('/auth/logout'),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token, newPassword) =>
    api.put(`/auth/reset-password/${token}`, { newPassword })
};

// ═══════════════════════════════════════════════════════
// PRODUCT API
// ═══════════════════════════════════════════════════════
export const productAPI = {
  getAll: (params) =>
    api.get('/products', { params }),

  getFeatured: () =>
    api.get('/products/featured'),

  getCategories: () =>
    api.get('/products/categories'),

  getById: (id) =>
    api.get(`/products/${id}`),

  // Admin
  create: (data) =>
    api.post('/products', data),

  update: (id, data) =>
    api.put(`/products/${id}`, data),

  delete: (id) =>
    api.delete(`/products/${id}`)
};

// ═══════════════════════════════════════════════════════
// CART API
// ═══════════════════════════════════════════════════════
export const cartAPI = {
  get: () =>
    api.get('/cart'),

  addItem: (productId, quantity = 1) =>
    api.post('/cart', { productId, quantity }),

  updateQuantity: (productId, quantity) =>
    api.put(`/cart/${productId}`, { quantity }),

  removeItem: (productId) =>
    api.delete(`/cart/${productId}`),

  clear: () =>
    api.delete('/cart')
};

// ═══════════════════════════════════════════════════════
// ORDER API
// ═══════════════════════════════════════════════════════
export const orderAPI = {
  create: (data) =>
    api.post('/orders', data),

  getAll: (params) =>
    api.get('/orders', { params }),

  getById: (id) =>
    api.get(`/orders/${id}`),

  cancel: (id) =>
    api.put(`/orders/${id}/cancel`),

  // Admin
  getAllAdmin: (params) =>
    api.get('/orders/admin/all', { params }),

  updateStatus: (id, data) =>
    api.put(`/orders/${id}/status`, data),

  getByOrderId: (orderId) =>
    api.get(`/orders/admin/order/${orderId}`)
};

// ═══════════════════════════════════════════════════════
// COUPON API
// ═══════════════════════════════════════════════════════
export const couponAPI = {
  validate: (code) =>
    api.post('/coupons/validate', { code }),

  // Admin
  getAll: () =>
    api.get('/coupons'),

  create: (data) =>
    api.post('/coupons', data),

  update: (id, data) =>
    api.put(`/coupons/${id}`, data),

  delete: (id) =>
    api.delete(`/coupons/${id}`)
};

// ═══════════════════════════════════════════════════════
// WISHLIST API
// ═══════════════════════════════════════════════════════
export const wishlistAPI = {
  get: () =>
    api.get('/wishlist'),

  add: (productId) =>
    api.post('/wishlist', { productId }),

  remove: (productId) =>
    api.delete(`/wishlist/${productId}`)
};

// ═══════════════════════════════════════════════════════
// ADMIN API
// ═══════════════════════════════════════════════════════
export const adminAPI = {
  getStats: () =>
    api.get('/admin/stats'),

  getUsers: (params) =>
    api.get('/admin/users', { params }),

  getUser: (id) =>
    api.get(`/admin/users/${id}`),

  updateUser: (id, data) =>
    api.put(`/admin/users/${id}`, data),

  getInventory: () =>
    api.get('/admin/inventory'),

  changePassword: (data) =>
    api.put('/admin/change-password', data)
};

export default api;
