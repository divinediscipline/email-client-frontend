'use client';

import React, { createContext, useContext, useState } from 'react';

interface EmailViewState {
  selectedFolder: string;
  selectedLabel: string | null;
}

interface EmailViewContextType {
  viewState: EmailViewState;
  setSelectedFolder: (folder: string) => void;
  setSelectedLabel: (label: string | null) => void;
  clearSelection: () => void;
  refreshCounts: () => void;
  countsRefreshTrigger: number;
}

const EmailViewContext = createContext<EmailViewContextType | undefined>(undefined);

export const useEmailView = () => {
  const context = useContext(EmailViewContext);
  if (context === undefined) {
    throw new Error('useEmailView must be used within an EmailViewProvider');
  }
  return context;
};

export const EmailViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewState, setViewState] = useState<EmailViewState>({
    selectedFolder: 'inbox',
    selectedLabel: null,
  });

  const [countsRefreshTrigger, setCountsRefreshTrigger] = useState(0);

  const setSelectedFolder = (folder: string) => {
    setViewState(prev => ({
      ...prev,
      selectedFolder: folder,
      selectedLabel: null, // Clear label when selecting folder
    }));
  };

  const setSelectedLabel = (label: string | null) => {
    setViewState(prev => ({
      ...prev,
      selectedLabel: label,
      selectedFolder: 'inbox', // Reset to inbox when selecting label
    }));
  };

  const clearSelection = () => {
    setViewState({
      selectedFolder: 'inbox',
      selectedLabel: null,
    });
  };

  const refreshCounts = () => {
    console.log(`=== REFRESH COUNTS CALLED ===`);
    console.log(`Current trigger value: ${countsRefreshTrigger}`);
    setCountsRefreshTrigger(prev => {
      const newValue = prev + 1;
      console.log(`New trigger value: ${newValue}`);
      return newValue;
    });
  };

  const value = {
    viewState,
    setSelectedFolder,
    setSelectedLabel,
    clearSelection,
    refreshCounts,
    countsRefreshTrigger,
  };

  return <EmailViewContext.Provider value={value}>{children}</EmailViewContext.Provider>;
}; 