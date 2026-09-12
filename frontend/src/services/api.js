/**
 * CreotexShop API Client Service
 * Configured to communicate with the Node.js Express backend (http://localhost:5000/api)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom fetch wrapper with automatic JWT Authorization header and JSON response parsing
 */
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('creotex_auth_token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
};

export const api = {
  // Healthcheck
  healthCheck: () => request('/health'),

  // Authentication & Users
  auth: {
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    getProfile: () => request('/auth/profile'),
    updateProfile: (profileData) =>
      request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      }),
    getAllUsers: () => request('/auth/users'),
    updateUser: (id, userData) =>
      request(`/auth/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      }),
    deleteUser: (id) =>
      request(`/auth/users/${id}`, {
        method: 'DELETE'
      })
  },

  // Products Catalog
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/products${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/products/${id}`),
    getCategories: () => request('/products/categories/all'),
    create: (productData) =>
      request('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      }),
    update: (id, productData) =>
      request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      }),
    delete: (id) =>
      request(`/products/${id}`, {
        method: 'DELETE'
      })
  },

  // Orders
  orders: {
    create: (orderData) =>
      request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      }),
    getMyOrders: () => request('/orders/my-orders'),
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/orders${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/orders/${id}`),
    updateStatus: (id, statusData) =>
      request(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(statusData)
      }),
    delete: (id) =>
      request(`/orders/${id}`, {
        method: 'DELETE'
      })
  },

  // Coupons
  coupons: {
    getAll: () => request('/coupons'),
    validate: (code, subtotal) =>
      request('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal })
      }),
    create: (couponData) =>
      request('/coupons', {
        method: 'POST',
        body: JSON.stringify(couponData)
      }),
    update: (id, couponData) =>
      request(`/coupons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(couponData)
      }),
    delete: (id) =>
      request(`/coupons/${id}`, {
        method: 'DELETE'
      })
  },

  // Customers (CRM)
  customers: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/customers${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/customers/${id}`),
    create: (customerData) =>
      request('/customers', {
        method: 'POST',
        body: JSON.stringify(customerData)
      }),
    update: (id, customerData) =>
      request(`/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(customerData)
      }),
    delete: (id) =>
      request(`/customers/${id}`, {
        method: 'DELETE'
      })
  },

  // Datasheets
  datasheets: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/datasheets${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/datasheets/${id}`),
    trackDownload: (id) =>
      request(`/datasheets/${id}/download`, {
        method: 'POST'
      }),
    create: (datasheetData) =>
      request('/datasheets', {
        method: 'POST',
        body: JSON.stringify(datasheetData)
      }),
    update: (id, datasheetData) =>
      request(`/datasheets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datasheetData)
      }),
    delete: (id) =>
      request(`/datasheets/${id}`, {
        method: 'DELETE'
      })
  },

  // Store Settings
  settings: {
    get: () => request('/settings'),
    update: (settingsData) =>
      request('/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsData)
      })
  },

  // Competition Robot Builder
  robotBuilder: {
    get: () => request('/robot-builder'),
    updatePresets: (presets) =>
      request('/robot-builder/presets', {
        method: 'PUT',
        body: JSON.stringify({ presets })
      }),
    updateSlots: (slots) =>
      request('/robot-builder/slots', {
        method: 'PUT',
        body: JSON.stringify({ slots })
      }),
    updateSettings: (settings) =>
      request('/robot-builder/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      })
  },

  // Analytics & Stats (Dashboard)
  stats: {
    getDashboard: () => request('/stats/dashboard')
  }
};

export default api;
