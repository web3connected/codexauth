'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import ApplicationLogo from '../widgets/ApplicationLogo';
import { SERVICES_CONFIG, ServiceLink } from '../config/services.config';
import {
  DEFAULT_AUTH_CONTEXT,
  DEFAULT_SERVICE,
  DEFAULT_LOGIN_ROUTES,
  DEFAULT_REGISTER_ROUTES,
  COMPONENT_WARNINGS,
} from '../config/defaults.config';

interface GlobalHeaderProps {
  className?: string;
  // TopBar widgets (4 slots in 2 columns)
  topbarWidgets?: Array<{
    slot: 'widget_01' | 'widget_02' | 'widget_03' | 'widget_04';
    name: string;
    component: React.ComponentType<any>;
    props?: any;
  }>;
  // Bottom widgets (logo + nav)
  logoWidget?: {
    name: string;
    component: React.ComponentType<any>;
    props?: any;
  };
  navWidget?: {
    name: string;
    component: React.ComponentType<any>;
    props?: any;
  };
}

/**
 * TopBar Component - 40px height
 * Manages widget slots for flexible topbar content
 * 
 * Example Usage from Database:
 * widgets: [
 *   { slot: 'widget_01', name: 'DateGreeter', component: DateGreeter },
 *   { slot: 'widget_02', name: 'SocialMediaLinks', component: SocialMediaLinks }
 * ]
 */
const TopBar: React.FC<{
  widgets?: Array<{
    slot: 'widget_01' | 'widget_02' | 'widget_03' | 'widget_04';
    name: string;
    component: React.ComponentType<any>;
    props?: any;
  }>;
}> = ({ widgets = [] }) => {
  // Organize widgets by slot
  const widgetsBySlot = {
    widget_01: widgets.find(w => w.slot === 'widget_01'),
    widget_02: widgets.find(w => w.slot === 'widget_02'),
    widget_03: widgets.find(w => w.slot === 'widget_03'),
    widget_04: widgets.find(w => w.slot === 'widget_04'),
  };

  return (
    <div className="h-10 border-b border-white/10 bg-black/20">
      <div className="w-full px-6 h-full grid grid-cols-2 items-center">
        {/* Left column: slots 1 & 2 */}
        <div className="flex items-center gap-4 justify-start">
          {widgetsBySlot.widget_01 && (
            <widgetsBySlot.widget_01.component {...(widgetsBySlot.widget_01.props || {})} />
          )}
          {widgetsBySlot.widget_02 && (
            <widgetsBySlot.widget_02.component {...(widgetsBySlot.widget_02.props || {})} />
          )}
        </div>
        
        {/* Right column: slots 3 & 4 */}
        <div className="flex items-center gap-4 justify-end">
          {widgetsBySlot.widget_03 && (
            <widgetsBySlot.widget_03.component {...(widgetsBySlot.widget_03.props || {})} />
          )}
          {widgetsBySlot.widget_04 && (
            <widgetsBySlot.widget_04.component {...(widgetsBySlot.widget_04.props || {})} />
          )}
        </div>
      </div>
    </div>
  );
};



const ServicesDropdown: React.FC<{ currentService?: string }> = ({ currentService }) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentServiceData = SERVICES_CONFIG.find(s => s.id === currentService);

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="nav-link px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/5 flex items-center gap-2"
      >
        <span>Services</span>
        <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute top-full left-0 mt-2 w-80 glass rounded-lg border border-gray-800 shadow-2xl z-50"
        >
          <div className="p-4">
            <div className="grid gap-2">
              {SERVICES_CONFIG.map((service) => (
                <Link
                  key={service.id}
                  href={service.url}
                  target={service.id !== currentService ? "_blank" : undefined}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                    service.id === currentService
                      ? 'bg-trinary/20 border border-trinary/30'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="text-2xl">{service.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        service.id === currentService ? 'text-trinary' : 'text-white group-hover:text-trinary'
                      }`}>
                        {service.name}
                      </span>
                      {service.id === currentService && (
                        <span className="text-xs bg-trinary/20 text-trinary px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300">
                      {service.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * GlobalHeader Component
 * Provides structure for header with widget slots
 * - TopBar: 40px with 4 widget slots (2 left, 2 right)
 * - Bottom: 100px with 2 widget slots (logo left, nav right)
 */
const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  className = "",
  topbarWidgets = [],
  logoWidget,
  navWidget,
}) => {
  return (
    <header className={`glass sticky top-0 z-40 ${className}`}>
      {/* Top Bar - 40px height with 4 widget slots */}
      <TopBar widgets={topbarWidgets} />

      {/* Bottom Section - 100px height with 2 widget slots */}
      <div className="h-25 border-b border-white/10">
        <div className="w-full px-6 h-full grid grid-cols-2 items-center">
          {/* Left column: Logo widget */}
          <div className="flex items-center gap-4">
            {logoWidget && <logoWidget.component {...(logoWidget.props || {})} />}
          </div>

          {/* Right column: Nav widget */}
          <div className="flex items-center gap-6 justify-end">
            {navWidget && <navWidget.component {...(navWidget.props || {})} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
