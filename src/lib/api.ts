import axios from 'axios';

const API_BASE_URL = 'https://test-api.squadinc.co/email-list/v1'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'identity', // Disable compression to avoid decoding errors
  },
  decompress: false, // Disable automatic decompression
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`=== API REQUEST ===`);
  console.log(`URL: ${config.url}`);
  console.log(`Method: ${config.method}`);
  console.log(`Headers:`, config.headers);
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`=== API RESPONSE ===`);
    console.log(`URL: ${response.config.url}`);
    console.log(`Status: ${response.status}`);
    console.log(`Data:`, response.data);
    return response;
  },
  (error) => {
    console.log(`=== API ERROR ===`);
    console.log(`URL: ${error.config?.url}`);
    console.log(`Status: ${error.response?.status}`);
    console.log(`Error:`, error);
    
    // Handle different error types
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (error.response?.status === 429) {
      console.warn('Rate limit exceeded. Please wait a moment before trying again.');
      // Show user-friendly message for rate limiting
      if (typeof window !== 'undefined') {
        alert('Too many requests. Please wait a moment and try again.');
      }
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
    view?: string;
    search?: string;
    labels?: string;
  }) => api.get('/api/emails', { params }),
  
  getEmail: (id: string) => api.get(`/api/emails/${id}`),
  
  markAsRead: (id: string) => api.patch(`/api/emails/${id}/read`),
  
  toggleStar: (id: string) => api.patch(`/api/emails/${id}/star`),
  
  toggleImportant: (id: string) => api.patch(`/api/emails/${id}/important`),
  
  getEmailCounts: () => api.get('/api/emails/counts'),
  
  getLabels: () => api.get('/api/emails/labels'),
  
  createLabel: (data: { name: string; color: string }) =>
    api.post('/api/emails/labels', data),
  
  addLabelToEmail: (emailId: string, label: string) =>
    api.patch(`/api/emails/${emailId}/labels/add`, { label }),
  
  removeLabelFromEmail: (emailId: string, label: string) =>
    api.patch(`/api/emails/${emailId}/labels/remove`, { label }),
  
  deleteLabel: (labelId: string) => api.delete(`/api/emails/labels/${labelId}`),
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
  markNotificationAsRead: (id: string) => api.patch(`/api/notifications/notifications/${id}/read`),
  markAllNotificationsAsRead: () => api.patch('/api/notifications/notifications/mark-all-read'),
  getMessages: () => api.get('/api/notifications/messages'),
  getUnreadMessageCount: () => api.get('/api/notifications/messages/unread-count'),
  markMessageAsRead: (id: string) => api.patch(`/api/notifications/messages/${id}/read`),
  markAllMessagesAsRead: () => api.patch('/api/notifications/messages/mark-all-read'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api; 