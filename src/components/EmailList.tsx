'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Square, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Paperclip
} from 'lucide-react';
import { emailsAPI } from '@/lib/api';
import { Email, PaginatedResponse } from '@/types';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { useEmailView } from '@/contexts/EmailViewContext';

export default function EmailList() {
  const { user, isLoading } = useAuth();
  const { viewState, refreshCounts } = useEmailView();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmails, setTotalEmails] = useState(0);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params: {
        page: number;
        limit: number;
        search?: string;
        view?: string; // Changed from folder to view
        labels?: string; // Changed from label to labels
      } = {
        page: currentPage,
        limit: 15,
      };

      // Add search query if provided
      if (searchQuery) {
        params.search = searchQuery;
      }

      // Handle view parameter for different email views
      if (viewState.selectedFolder && !viewState.selectedLabel) {
        // Map folder names to view parameters
        if (viewState.selectedFolder === 'starred') {
          params.view = 'starred';
        } else if (viewState.selectedFolder === 'important') {
          params.view = 'important';
        } else if (viewState.selectedFolder === 'unread') {
          params.view = 'unread';
        } else {
          // For other folders like inbox, sent, drafts, trash, use the folder name as view
          params.view = viewState.selectedFolder;
        }
      }

      // Add labels filter if a label is selected
      if (viewState.selectedLabel) {
        params.labels = viewState.selectedLabel;
      }

      console.log('=== FETCHING EMAILS ===');
      console.log('Params:', params);
      console.log('Selected folder:', viewState.selectedFolder);
      console.log('Selected label:', viewState.selectedLabel);

      const response = await emailsAPI.getEmails(params);
      
      const data = response.data as PaginatedResponse<Email>;
      console.log('=== EMAILS RESPONSE ===');
      console.log('Total emails:', data.data.length);
      
      // Log starred status for each email
      data.data.forEach((email, index) => {
        console.log(`Email ${index + 1}:`, {
          id: email.id,
          subject: email.subject,
          isStarred: email.isStarred,
          from: email.from
        });
      });
      
      setEmails(data.data);
      setTotalEmails(data.pagination.total);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, viewState.selectedFolder, viewState.selectedLabel]);

  useEffect(() => {
    // Only fetch emails if user is authenticated and not loading
    if (!user || isLoading) {
      return;
    }
    fetchEmails();
  }, [fetchEmails, user, isLoading]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [viewState.selectedFolder, viewState.selectedLabel, searchQuery]);

  const handleEmailSelect = (emailId: string) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(emailId)) {
      newSelected.delete(emailId);
    } else {
      newSelected.add(emailId);
    }
    setSelectedEmails(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedEmails.size === emails.length) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(emails.map(email => email.id)));
    }
  };

  const handleStarToggle = async (emailId: string) => {
    // Find the email to get its current starred state
    const email = emails.find(e => e.id === emailId);
    const currentStarredState = email?.isStarred || false;
    
    console.log(`=== STAR TOGGLE DEBUG ===`);
    console.log(`Email ID: ${emailId}`);
    console.log(`Current starred state: ${currentStarredState}`);
    console.log(`Will toggle to: ${!currentStarredState}`);
    
    // Optimistically update the UI first
    setEmails(prev => prev.map(email => 
      email.id === emailId 
        ? { ...email, isStarred: !email.isStarred }
        : email
    ));
    
    try {
      console.log(`Making API call to toggle star...`);
      const response = await emailsAPI.toggleStar(emailId);
      console.log(`API Response:`, response);
      console.log(`Response status: ${response.status}`);
      console.log(`Response data:`, response.data);
      
      // Force refresh counts after successful toggle
      console.log(`Scheduling count refresh...`);
      setTimeout(() => {
        console.log(`Executing count refresh...`);
        refreshCounts();
      }, 1000); // Increased delay to 1 second
      
      // Also try a second refresh after a longer delay
      setTimeout(() => {
        console.log(`Executing second count refresh...`);
        refreshCounts();
      }, 2000); // Second refresh after 2 seconds
      
    } catch (error) {
      console.error('Error toggling star:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        status: (error as { response?: { status?: number } })?.response?.status,
        data: (error as { response?: { data?: unknown } })?.response?.data
      });
      // Revert the optimistic update on error
      setEmails(prev => prev.map(email => 
        email.id === emailId 
          ? { ...email, isStarred: !email.isStarred } // Revert back
          : email
      ));
      // Show user-friendly error message
      alert('Unable to toggle star. Please try again later.');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Handle ISO date strings (which is what the API returns)
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Invalid Date';
      }
      
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error, 'Date string:', dateString);
      return 'Invalid Date';
    }
  };

  const getHeaderTitle = () => {
    if (viewState.selectedLabel) {
      return viewState.selectedLabel;
    }
    
    const folderNames: { [key: string]: string } = {
      inbox: 'Inbox',
      starred: 'Starred',
      sent: 'Sent',
      important: 'Important',
      drafts: 'Drafts',
      trash: 'Trash',
    };
    
    return folderNames[viewState.selectedFolder] || 'Inbox';
  };

  const totalPages = Math.ceil(totalEmails / 15);
  const startEmail = (currentPage - 1) * 15 + 1;
  const endEmail = Math.min(currentPage * 15, totalEmails);

  return (
    <div className="flex-1 bg-white h-full flex flex-col">
      {/* Email Content Header */}
      <div className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">{getHeaderTitle()}</h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search bar without lens icon */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
            {/* Pagination with circular borders */}
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <span className="hidden sm:inline">{startEmail}-{endEmail} of {totalEmails}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-6 h-6 sm:w-8 sm:h-8 border border-black rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-6 h-6 sm:w-8 sm:h-8 border border-black rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar - no border */}
      <div className="px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={handleSelectAll}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Square className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
          </button>
          {/* Refresh icon with circular border */}
          <button
            onClick={() => {
              fetchEmails();
              refreshCounts(); // Also refresh sidebar counts
            }}
            className="w-6 h-6 sm:w-8 sm:h-8 border border-black rounded-full flex items-center justify-center hover:bg-gray-100"
          >
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="md" />
            </div>
          ) : !user ? (
            <div className="text-center py-12 text-gray-500">
              Please log in to view emails
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="md" />
            </div>
          ) : emails.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No emails found
            </div>
          ) : (
            emails.map((email) => (
              <div
                key={email.id}
                className={`px-3 sm:px-6 py-3 sm:py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-black ${
                  !email.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() => handleEmailSelect(email.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Square className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                  </button>
                  
                  <button
                    onClick={() => handleStarToggle(email.id)}
                    className="p-1 hover:bg-gray-100 rounded relative"
                  >
                    <Star 
                      className={`h-3 w-3 sm:h-4 sm:w-4 ${
                        email.isStarred
                          ? 'text-[#ff6900]' 
                          : 'text-black'
                      }`}
                      style={{
                        fill: email.isStarred ? '#ff6900' : 'none'
                      }}
                      title={`Starred: ${email.isStarred}`}
                    />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-medium truncate ${
                          !email.isRead ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {email.from}
                        </p>
                        <p className={`text-xs sm:text-sm truncate ${
                          !email.isRead ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {email.subject}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4">
                        {email.hasAttachments && (
                          <Paperclip className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                        )}
                        <span className="text-xs text-gray-500">
                          {formatDate(email.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-black px-3 sm:px-6 py-3 sm:py-4">
        <div className="text-center text-xs sm:text-sm text-gray-500">
          Copyright 2025
        </div>
      </div>
    </div>
  );
} 