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
  const [selectedEmails, setSelectedEmails] = useState<Set<number>>(new Set());

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

  const handleEmailSelect = (emailId: number) => {
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

  const handleStarToggle = async (emailId: number) => {
    try {
      await emailsAPI.toggleStar(emailId);
      setEmails(prev => prev.map(email => 
        email.id === emailId 
          ? { ...email, isStarred: !email.isStarred }
          : email
      ));
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If the date is invalid, try to parse it as a timestamp
        const timestamp = parseInt(dateString);
        if (!isNaN(timestamp)) {
          const dateFromTimestamp = new Date(timestamp);
          if (!isNaN(dateFromTimestamp.getTime())) {
            const now = new Date();
            const diffInHours = (now.getTime() - dateFromTimestamp.getTime()) / (1000 * 60 * 60);
            
            if (diffInHours < 24) {
              return dateFromTimestamp.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              });
            } else if (diffInHours < 48) {
              return 'Yesterday';
            } else {
              return dateFromTimestamp.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              });
            }
          }
        }
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
                className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            {/* Pagination with circular borders */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{startEmail}-{endEmail} of {totalEmails}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100"
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
                className={`px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-black ${
                  !email.isRead ? 'bg-blue-50' : ''
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
                        email.isStarred 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          !email.isRead ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {email.from}
                        </p>
                        <p className={`text-sm truncate ${
                          !email.isRead ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {email.subject}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {email.hasAttachment && (
                          <Paperclip className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-xs text-gray-500">
                          {formatDate(email.createdAt)}
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
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="text-center text-sm text-gray-500">
          Copyright 2025
        </div>
      </div>
    </div>
  );
} 