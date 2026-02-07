import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
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
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Services
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

export const bookService = {
  getBooks: async (params?: any) => {
    const response = await api.get('/books/', { params });
    return response.data;
  },

  getBook: async (id: number) => {
    const response = await api.get(`/books/${id}/`);
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
};

export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },

  getCategoryBooks: async (id: number) => {
    const response = await api.get(`/categories/${id}/books/`);
    return response.data;
  },
};

export const transactionService = {
  getTransactions: async (params?: any) => {
    const response = await api.get('/transactions/', { params });
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

  issueBook: async (data: any) => {
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

  getStatistics: async () => {
    const response = await api.get('/transactions/statistics/');
    return response.data;
  },
};

export const reservationService = {
  getReservations: async (params?: any) => {
    const response = await api.get('/reservations/', { params });
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
