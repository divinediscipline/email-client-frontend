import axios from 'axios';

const API_BASE_URL = 'https://email-list-api.onrender.com';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string; role: string }) =>
    api.post('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  
  getProfile: () => api.get('/api/auth/profile'),
  
  updateProfile: (data: { name?: string; role?: string }) =>
    api.put('/api/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/api/auth/change-password', data),
  
  logout: () => api.post('/api/auth/logout'),
};

// Emails API
export const emailsAPI = {
  getEmails: (params?: {
    page?: number;
    limit?: number;
    folder?: string;
    isRead?: boolean;
    search?: string;
  }) => api.get('/api/emails', { params }),
  
  getEmail: (id: number) => api.get(`/api/emails/${id}`),
  
  markAsRead: (id: number) => api.patch(`/api/emails/${id}/read`),
  
  toggleStar: (id: number) => api.patch(`/api/emails/${id}/star`),
  
  toggleImportant: (id: number) => api.patch(`/api/emails/${id}/important`),
  
  moveEmail: (id: number, folder: string) =>
    api.patch(`/api/emails/${id}/move`, { folder }),
  
  getEmailCounts: () => api.get('/api/emails/counts'),
  
  getLabels: () => api.get('/api/emails/labels'),
  
  createLabel: (data: { name: string; color: string }) =>
    api.post('/api/emails/labels', data),
  
  addLabelToEmail: (emailId: number, label: string) =>
    api.patch(`/api/emails/${emailId}/labels/add`, { label }),
  
  removeLabelFromEmail: (emailId: number, label: string) =>
    api.patch(`/api/emails/${emailId}/labels/remove`, { label }),
  
  deleteLabel: (labelId: number) => api.delete(`/api/emails/labels/${labelId}`),
};

// Navigation API
export const navigationAPI = {
  getItems: () => api.get('/api/navigation/items'),
  getUpgradeInfo: () => api.get('/api/navigation/upgrade-info'),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () => api.get('/api/notifications/notifications'),
  getUnreadNotificationCount: () => api.get('/api/notifications/notifications/unread-count'),
  markNotificationAsRead: (id: number) => api.patch(`/api/notifications/notifications/${id}/read`),
  markAllNotificationsAsRead: () => api.patch('/api/notifications/notifications/mark-all-read'),
  getMessages: () => api.get('/api/notifications/messages'),
  getUnreadMessageCount: () => api.get('/api/notifications/messages/unread-count'),
  markMessageAsRead: (id: number) => api.patch(`/api/notifications/messages/${id}/read`),
  markAllMessagesAsRead: () => api.patch('/api/notifications/messages/mark-all-read'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api; 