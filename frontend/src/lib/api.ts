import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============= AUTH SERVICES =============
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login/', { username, password });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me/');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/users/update_profile/', data);
    return response.data;
  },
};

// ============= USER SERVICES =============
export const userService = {
  getUsers: async (params?: any) => {
    const response = await api.get('/users/', { params });
    return response.data;
  },

  getUser: async (id: number) => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },

  createUser: async (data: any) => {
    const response = await api.post('/users/', data);
    return response.data;
  },

  updateUser: async (id: number, data: any) => {
    const response = await api.put(`/users/${id}/`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/users/${id}/`);
    return response.data;
  },

  getUserTransactions: async (id: number) => {
    const response = await api.get(`/users/${id}/transactions/`);
    return response.data;
  },

  getUserReservations: async (id: number) => {
    const response = await api.get(`/users/${id}/reservations/`);
    return response.data;
  },
};

// ============= BOOK SERVICES =============
export const bookService = {
  getBooks: async (params?: any) => {
    const response = await api.get('/books/', { params });
    return response.data;
  },

  getBook: async (id: number) => {
    const response = await api.get(`/books/${id}/`);
    return response.data;
  },

  createBook: async (data: any) => {
    const response = await api.post('/books/', data);
    return response.data;
  },

  updateBook: async (id: number, data: any) => {
    const response = await api.put(`/books/${id}/`, data);
    return response.data;
  },

  deleteBook: async (id: number) => {
    const response = await api.delete(`/books/${id}/`);
    return response.data;
  },

  getAvailableBooks: async () => {
    const response = await api.get('/books/available/');
    return response.data;
  },

  searchBooks: async (query: string) => {
    const response = await api.get('/books/', { params: { search: query } });
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/books/statistics/');
    return response.data;
  },

  getBookTransactions: async (id: number) => {
    const response = await api.get(`/books/${id}/transactions/`);
    return response.data;
  },
};

// ============= CATEGORY SERVICES =============
export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },

  getCategory: async (id: number) => {
    const response = await api.get(`/categories/${id}/`);
    return response.data;
  },

  createCategory: async (data: any) => {
    const response = await api.post('/categories/', data);
    return response.data;
  },

  updateCategory: async (id: number, data: any) => {
    const response = await api.put(`/categories/${id}/`, data);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await api.delete(`/categories/${id}/`);
    return response.data;
  },

  getCategoryBooks: async (id: number) => {
    const response = await api.get(`/categories/${id}/books/`);
    return response.data;
  },
};

// ============= TRANSACTION SERVICES =============
export const transactionService = {
  getTransactions: async (params?: any) => {
    const response = await api.get('/transactions/', { params });
    return response.data;
  },

  getTransaction: async (id: number) => {
    const response = await api.get(`/transactions/${id}/`);
    return response.data;
  },

  getActiveTransactions: async () => {
    const response = await api.get('/transactions/active/');
    return response.data;
  },

  getOverdueTransactions: async () => {
    const response = await api.get('/transactions/overdue/');
    return response.data;
  },

  createTransaction: async (data: { user: number; book: number; due_date?: string }) => {
    const response = await api.post('/transactions/', data);
    return response.data;
  },

  issueBook: async (data: { user: number; book: number; due_date: string }) => {
    const response = await api.post('/transactions/issue_book/', data);
    return response.data;
  },

  returnBook: async (transactionId: number, remarks?: string) => {
    const response = await api.post('/transactions/return_book/', {
      transaction_id: transactionId,
      remarks,
    });
    return response.data;
  },

  renewBook: async (transactionId: number, newDueDate: string) => {
    const response = await api.post(`/transactions/${transactionId}/renew/`, {
      new_due_date: newDueDate,
    });
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/transactions/statistics/');
    return response.data;
  },
};

// ============= RESERVATION SERVICES =============
export const reservationService = {
  getReservations: async (params?: any) => {
    const response = await api.get('/reservations/', { params });
    return response.data;
  },

  getReservation: async (id: number) => {
    const response = await api.get(`/reservations/${id}/`);
    return response.data;
  },

  createReservation: async (bookId: number) => {
    const response = await api.post('/reservations/', { book: bookId });
    return response.data;
  },

  cancelReservation: async (id: number) => {
    const response = await api.post(`/reservations/${id}/cancel/`);
    return response.data;
  },

  getActiveReservations: async () => {
    const response = await api.get('/reservations/active/');
    return response.data;
  },
};

export default api;
