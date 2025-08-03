'use client';

import { useState, useEffect } from 'react';
import { 
  Mail, 
  Star, 
  Send, 
  AlertTriangle, 
  FileText, 
  Trash2, 
  Tag, 
  Plus,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { emailsAPI } from '@/lib/api';
import { EmailCounts, Label } from '@/types';

export default function EmailSidebar() {
  const { user } = useAuth();
  const [emailCounts, setEmailCounts] = useState<EmailCounts | null>(null);
  const [labels, setLabels] = useState<Label[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch email counts
        try {
          const countsResponse = await emailsAPI.getEmailCounts();
          setEmailCounts(countsResponse.data.data);
        } catch {
          console.warn('API has no email counts data');
          setEmailCounts(null);
        }

        // Try to fetch labels
        try {
          const labelsResponse = await emailsAPI.getLabels();
          setLabels(labelsResponse.data.data);
        } catch {
          console.warn('API has no labels data');
          setLabels([]);
        }
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      }
    };

    fetchData();
  }, []);

  const emailFolders = [
    { name: 'Inbox', icon: Mail, count: emailCounts?.inbox || 24, active: true },
    { name: 'Starred', icon: Star, count: emailCounts?.starred || 0 },
    { name: 'Sent', icon: Send, count: emailCounts?.sent || 0 },
    { name: 'Important', icon: AlertTriangle, count: emailCounts?.important || 0 },
    { name: 'Drafts', icon: FileText, count: emailCounts?.drafts || 30 },
    { name: 'Trash', icon: Trash2, count: emailCounts?.trash || 0 },
  ];

  return (
    <aside className="w-80 bg-white h-screen overflow-y-auto">
      <div className="p-6">
        {/* User Profile - side by side */}
        <div className="mb-6 flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{user?.name || 'Ari Budin'}</div>
            <div className="text-sm text-gray-500">{user?.role || 'Web developer'}</div>
          </div>
        </div>

        {/* Compose Button - same size as inbox */}
        <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 mb-6">
          <Plus className="h-4 w-4" />
          <span>Compose</span>
        </button>

        {/* Email Folders */}
        <div className="space-y-1 mb-6">
          {emailFolders.map((folder) => (
            <button
              key={folder.name}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                folder.active
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <folder.icon className="h-4 w-4" />
                <span>{folder.name}</span>
              </div>
              {folder.count > 0 && (
                <span className="text-xs text-gray-500">{folder.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Labels */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Labels</h3>
          <div className="space-y-1">
            {labels.length > 0 ? (
              labels.map((label) => (
                <button
                  key={label.id}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <Tag className="h-4 w-4" />
                  <span>{label.name}</span>
                </button>
              ))
            ) : (
              // Fallback labels as shown in the image
              ['Work', 'Family', 'Friends', 'Office'].map((label) => (
                <button
                  key={label}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <Tag className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
} 