'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  BarChart3,
  Briefcase,
  FileText,
  Users,
  Smartphone,
  Globe,
  Plus,
  Calendar,
  Receipt,
  Grid,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function GlobalSidebar() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    apps: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navigationItems = [
    { name: 'Analytics', icon: BarChart3, href: '#' },
    { name: 'Business', icon: Briefcase, href: '#', active: true },
    { name: 'Project', icon: FileText, href: '#' },
    { name: 'HRM', icon: Users, href: '#' },
    { name: 'Mobile App', icon: Smartphone, href: '#' },
    { name: 'Landingpage', icon: Globe, href: '#' },
  ];

  const collapsibleSections = [
    { name: 'Components', icon: Plus },
    { name: 'Pages', icon: FileText },
    { name: 'Apps', icon: Mail },
    { name: 'Content', icon: FileText },
    { name: 'Users', icon: Users },
    { name: 'Documentation', icon: BookOpen },
  ];

  const appItems = [
    { name: 'Calendar', icon: Calendar },
    { name: 'Email', icon: Mail, active: true },
    { name: 'Invoice', icon: Receipt },
    { name: 'Charts', icon: BarChart3 },
    { name: 'Widgets', icon: Grid },
  ];

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4">
        {/* Top Navigation */}
        <div className="space-y-1 mb-6">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-1 mb-6">
          {collapsibleSections.map((section) => (
            <div key={section.name}>
              <button
                onClick={() => toggleSection(section.name.toLowerCase())}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <section.icon className="h-4 w-4" />
                  <span>{section.name}</span>
                </div>
                {expandedSections[section.name.toLowerCase()] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              
              {section.name === 'Apps' && expandedSections.apps && (
                <div className="ml-6 mt-1 space-y-1">
                  {appItems.map((item) => (
                    <button
                      key={item.name}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        item.active
                          ? 'bg-black text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Upgrade to Pro */}
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Upgrade to Pro</h3>
          <p className="text-xs text-gray-600 mb-3">
            Are you looking for more features? Check out our Pro version.
          </p>
          <button className="w-full bg-green-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2">
            <span>Upgrade Now</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </aside>
  );
} 