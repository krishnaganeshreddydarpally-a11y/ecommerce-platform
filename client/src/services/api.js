const API_BASE = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : '/api';

export async function apiRequest(endpoint, { method = 'GET', body, headers = {} } = {}) {
  const token = localStorage.getItem('eshop_token');
  
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json().catch(() => ({ message: 'Invalid response from server' }));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: userData }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (profile) => apiRequest('/auth/profile', { method: 'PUT', body: profile }),

  // Products
  getProducts: (params = '') => apiRequest(`/products${params ? `?${params}` : ''}`),
  getProductById: (id) => apiRequest(`/products/${id}`),
  addReview: (id, review) => apiRequest(`/products/${id}/reviews`, { method: 'POST', body: review }),

  // Categories
  getCategories: () => apiRequest('/categories'),
  createCategory: (category) => apiRequest('/categories', { method: 'POST', body: category }),
  updateCategory: (id, category) => apiRequest(`/categories/${id}`, { method: 'PUT', body: category }),
  deleteCategory: (id) => apiRequest(`/categories/${id}`, { method: 'DELETE' }),

  // Orders
  createOrder: (orderData) => apiRequest('/orders', { method: 'POST', body: orderData }),
  getMyOrders: () => apiRequest('/orders/my-orders'),
  getOrderById: (id) => apiRequest(`/orders/${id}`),
  cancelOrder: (id) => apiRequest(`/orders/${id}/cancel`, { method: 'POST' }),

  // Admin
  getAdminStats: () => apiRequest('/admin/stats'),
  getAdminOrders: (status) => apiRequest(`/admin/orders${status ? `?status=${status}` : ''}`),
  updateOrderStatus: (id, status, note) => apiRequest(`/admin/orders/${id}/status`, { method: 'PUT', body: { status, note } }),
  getAdminUsers: () => apiRequest('/admin/users'),
  updateUserRole: (id, role) => apiRequest(`/admin/users/${id}/role`, { method: 'PUT', body: { role } }),
  createProduct: (product) => apiRequest('/products', { method: 'POST', body: product }),
  updateProduct: (id, product) => apiRequest(`/products/${id}`, { method: 'PUT', body: product }),
  deleteProduct: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
};

