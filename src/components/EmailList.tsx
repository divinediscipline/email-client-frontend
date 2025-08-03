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

export default function EmailList() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmails, setTotalEmails] = useState(0);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await emailsAPI.getEmails({
        page: currentPage,
        limit: 15,
        search: searchQuery || undefined,
      });
      
      const data = response.data as PaginatedResponse<Email>;
      setEmails(data.data);
      setTotalEmails(data.pagination.total);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

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
    // Optimistically update the UI first
    setEmails(prev => prev.map(email => 
      email.id === emailId 
        ? { ...email, is_starred: !email.is_starred }
        : email
    ));
    
    try {
      await emailsAPI.toggleStar(emailId);
      // If successful, the UI is already updated
    } catch (error) {
      console.error('Error toggling star:', error);
      // Revert the optimistic update on error
      setEmails(prev => prev.map(email => 
        email.id === emailId 
          ? { ...email, is_starred: !email.is_starred } // Revert back
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

  const totalPages = Math.ceil(totalEmails / 15);
  const startEmail = (currentPage - 1) * 15 + 1;
  const endEmail = Math.min(currentPage * 15, totalEmails);

  return (
    <div className="flex-1 bg-white h-full flex flex-col">
      {/* Email Content Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Inbox</h1>
          <div className="flex items-center space-x-4">
            {/* Search bar without lens icon */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            {/* Pagination with circular borders */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{startEmail}-{endEmail} of {totalEmails}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 border border-black rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 border border-black rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar - no border */}
      <div className="px-6 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSelectAll}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Square className="h-4 w-4 text-gray-600" />
          </button>
          {/* Refresh icon with circular border */}
          <button
            onClick={fetchEmails}
            className="w-8 h-8 border border-black rounded-full flex items-center justify-center hover:bg-gray-100"
          >
            <RefreshCw className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        <div>
          {loading ? (
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
                className={`px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-black ${
                  !email.is_read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleEmailSelect(email.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Square className="h-4 w-4 text-gray-600" />
                  </button>
                  
                  <button
                    onClick={() => handleStarToggle(email.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Star 
                      className={`h-4 w-4 ${
                        email.is_starred 
                          ? 'fill-[#ff6900] text-[#ff6900]' 
                          : 'text-black'
                      }`} 
                    />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          !email.is_read ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {email.from}
                        </p>
                        <p className={`text-sm truncate ${
                          !email.is_read ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {email.subject}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {email.has_attachments && (
                          <Paperclip className="h-4 w-4 text-gray-400" />
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
      <div className="border-t border-black px-6 py-4">
        <div className="text-center text-sm text-gray-500">
          Copyright 2025
        </div>
      </div>
    </div>
  );
} 