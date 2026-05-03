'use client';

import React from 'react';

export interface DocNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface DocsSidebarLayoutProps {
  /** Title displayed above the nav in the sidebar */
  sidebarTitle?: string;
  navItems: DocNavItem[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  children: React.ReactNode;
}

export const DocsSidebarLayout: React.FC<DocsSidebarLayoutProps> = ({
  sidebarTitle = 'Documentation',
  navItems,
  activeSection,
  onSectionChange,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4">{sidebarTitle}</h3>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                      activeSection === item.id
                        ? 'bg-hash-primary/20 text-hash-primary border border-hash-primary/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span className="shrink-0 w-4 h-4">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DocsSidebarLayout;
