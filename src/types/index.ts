export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Email {
  id: number;
  from: string;
  to: string;
  subject: string;
  body: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  folder: string;
  labels: string[];
  hasAttachment: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailCounts {
  inbox: number;
  starred: number;
  sent: number;
  important: number;
  drafts: number;
  trash: number;
}

export interface Label {
  id: number;
  name: string;
  color: string;
  createdAt: string;
}

export interface NavigationItem {
  id: number;
  name: string;
  icon: string;
  href: string;
  isActive: boolean;
  children?: NavigationItem[];
}

export interface UpgradeInfo {
  title: string;
  description: string;
  buttonText: string;
  features: string[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

export interface Message {
  id: number;
  from: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 