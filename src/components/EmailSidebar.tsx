'use client';

import { useState, useEffect } from 'react';
import { 
  Mail, 
  Star, 
  Send, 
  Flag, 
  FileText, 
  Trash2, 
  Tag, 
  Pen,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEmailView } from '@/contexts/EmailViewContext';
import { emailsAPI } from '@/lib/api';
import { EmailCounts, Label } from '@/types';

export default function EmailSidebar() {
  const { user, isLoading } = useAuth();
  const { viewState, setSelectedFolder, setSelectedLabel, countsRefreshTrigger } = useEmailView();
  const [emailCounts, setEmailCounts] = useState<EmailCounts | null>(null);
  const [labels, setLabels] = useState<Label[]>([]);

  useEffect(() => {
    if (!user || isLoading) {
      return;
    }

    const fetchData = async () => {
      try {
        // Try to fetch email counts
        try {
          console.log(`=== FETCHING EMAIL COUNTS ===`);
          const countsResponse = await emailsAPI.getEmailCounts();
          console.log(`Counts API Response:`, countsResponse.data);
          // API returns { success: true, data: {...counts...} }
          const countsData = countsResponse.data.data || countsResponse.data;
          console.log(`Counts data:`, countsData);
          setEmailCounts(countsData);
        } catch (error) {
          console.warn('API has no email counts data', error);
          setEmailCounts(null);
        }

        // Try to fetch labels
        try {
          const labelsResponse = await emailsAPI.getLabels();
          // API returns { success: true, data: [...labels...] }
          const labelsData = labelsResponse.data.data || labelsResponse.data;
          setLabels(Array.isArray(labelsData) ? labelsData : []);
        } catch {
          console.warn('API has no labels data');
          setLabels([]);
        }
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      }
    };

    fetchData();
  }, [user, isLoading, countsRefreshTrigger]); // Use countsRefreshTrigger from context

  const emailFolders = [
    { name: 'Inbox', value: 'inbox', icon: Mail, count: emailCounts?.inbox || 24 },
    { name: 'Starred', value: 'starred', icon: Star, count: emailCounts?.starred || 0 },
    { name: 'Sent', value: 'sent', icon: Send, count: emailCounts?.sent || 0 },
    { name: 'Important', value: 'important', icon: Flag, count: emailCounts?.important || 0 },
    { name: 'Drafts', value: 'drafts', icon: FileText, count: emailCounts?.drafts || 0 },
    { name: 'Trash', value: 'trash', icon: Trash2, count: emailCounts?.trash || 0 },
  ];

  const handleFolderClick = (folderValue: string) => {
    setSelectedFolder(folderValue);
  };

  const handleLabelClick = (labelName: string) => {
    setSelectedLabel(labelName);
  };

  // Show loading state if authentication is still loading
  if (isLoading) {
    return (
      <aside className="w-64 lg:w-64 xl:w-72 bg-white h-screen overflow-y-auto">
        <div className="p-3 sm:p-4">
          <div className="animate-pulse">
            <div className="mb-4 flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full"></div>
              <div className="hidden sm:block">
                <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 lg:w-64 xl:w-72 bg-white h-screen overflow-y-auto">
      <div className="p-3 sm:p-4">
        {/* User Profile - side by side */}
        <div className="mb-4 flex items-center space-x-2 sm:space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
          </div>
          <div className="hidden sm:block">
            <div className="font-medium text-gray-900 text-sm">{user?.name || 'Ari Budin'}</div>
            <div className="text-xs text-gray-500">{user?.role || 'Web developer'}</div>
          </div>
        </div>

        {/* Compose Button - custom green with pen icon and black border */}
        <button className="w-full text-gray-900 py-2 px-3 sm:px-4 rounded font-medium hover:opacity-80 transition-colors flex items-center justify-center space-x-2 mb-4 border border-black text-xs sm:text-sm" style={{ backgroundColor: '#d9f999' }}>
          <Pen className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Compose</span>
        </button>

        {/* Email Folders */}
        <div className="space-y-1 mb-4">
          {emailFolders.map((folder) => (
            <button
              key={folder.name}
              onClick={() => handleFolderClick(folder.value)}
              className={`w-full flex items-center justify-between px-2 sm:px-3 py-2 rounded text-xs sm:text-sm font-medium transition-colors ${
                viewState.selectedFolder === folder.value && !viewState.selectedLabel
                  ? 'bg-white text-black border border-black'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <folder.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{folder.name}</span>
              </div>
              {folder.count > 0 && (
                <span className="text-xs text-gray-500">{folder.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Labels */}
        <div className="mb-4">
          <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-3 hidden sm:block">Labels</h3>
          <div className="space-y-1">
            {labels.length > 0 ? (
              labels.map((label) => (
                <button
                  key={label.id}
                  onClick={() => handleLabelClick(label.name)}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    viewState.selectedLabel === label.name
                      ? 'bg-white text-black border border-black'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{label.name}</span>
                </button>
              ))
            ) : (
              // Fallback labels as shown in the image
              ['Work', 'Family', 'Friends', 'Office'].map((label) => (
                <button
                  key={label}
                  onClick={() => handleLabelClick(label)}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    viewState.selectedLabel === label
                      ? 'bg-white text-black border border-black'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
} 