export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Email {
  id: string;
  userId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  folder: string;
  labels: string[];
  hasAttachments: boolean;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  attachments: unknown[];
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
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface NavigationItem {
  id: string;
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
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  type: string;
  created_at: string;
}

export interface Message {
  id: string;
  from: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
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