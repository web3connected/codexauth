"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
}

interface NavigationProps {
  items: NavItem[];
  orientation?: "horizontal" | "vertical";
  theme?: "dark" | "light";
  className?: string;
}

/**
 * Navigation Widget
 *
 * Flexible navigation component that can be:
 * - Horizontal (for headers)
 * - Vertical (for sidebars)
 * - Nested (with submenus)
 *
 * Features improved hover behavior with delays to prevent accidental closes
 */
const Navigation: React.FC<NavigationProps> = ({
  items,
  orientation = "horizontal",
  theme = "dark",
  className = "",
}) => {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>(
    {},
  );
  const timeoutRefs = useRef<Record<number, NodeJS.Timeout>>({});

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach((timeout) =>
        clearTimeout(timeout),
      );
    };
  }, []);

  const handleMouseEnter = (index: number) => {
    // Clear any existing close timeout
    if (timeoutRefs.current[index]) {
      clearTimeout(timeoutRefs.current[index]);
    }

    // Open dropdown after a short delay (200ms)
    timeoutRefs.current[index] = setTimeout(() => {
      setOpenDropdowns((prev) => ({ ...prev, [index]: true }));
    }, 200);
  };

  const handleMouseLeave = (index: number) => {
    // Clear any existing open timeout
    if (timeoutRefs.current[index]) {
      clearTimeout(timeoutRefs.current[index]);
    }

    // Close dropdown after a delay (300ms) to allow moving to submenu
    timeoutRefs.current[index] = setTimeout(() => {
      setOpenDropdowns((prev) => ({ ...prev, [index]: false }));
    }, 300);
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  const baseClasses =
    theme === "dark"
      ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100";

  const activeClasses =
    theme === "dark"
      ? "text-white bg-gray-800/80"
      : "text-gray-900 bg-gray-200";

  const containerClasses =
    orientation === "horizontal"
      ? "flex items-center space-x-1"
      : "flex flex-col space-y-1";

  return (
    <nav className={`${containerClasses} ${className}`}>
      {items.map((item, index) => {
        // If item has children, render with dropdown
        if (item.children && item.children.length > 0) {
          return (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <button
                className={`
                  px-4 py-2 rounded-lg
                  transition-colors duration-200
                  font-medium text-sm
                  flex items-center gap-2
                  ${baseClasses}
                `}
              >
                {item.icon && <span className={`fa fa-${item.icon}`} />}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className="
                    px-2 py-0.5 rounded-full
                    bg-blue-600 text-white
                    text-xs font-semibold
                  "
                  >
                    {item.badge}
                  </span>
                )}
                <svg
                  className={`w-4 h-4 ml-1 transition-transform ${openDropdowns[index] ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Submenu */}
              <div
                className={`
                  absolute top-full left-0 mt-2
                  ${openDropdowns[index] ? "block" : "hidden"}
                  ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}
                  rounded-lg border shadow-2xl
                  min-w-[200px]
                  z-50
                  transition-opacity duration-200
                `}
              >
                <div className="p-2">
                  {item.children.map((child, childIndex) => (
                    <Link
                      key={childIndex}
                      href={child.href}
                      className={`
                        block px-4 py-2 rounded-lg
                        text-sm transition-colors
                        ${isActive(child.href) ? activeClasses : baseClasses}
                      `}
                    >
                      {child.icon && (
                        <span className={`fa fa-${child.icon} mr-2`} />
                      )}
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        // Regular link without dropdown
        return (
          <Link
            key={index}
            href={item.href}
            className={`
              px-4 py-2 rounded-lg
              transition-colors duration-200
              font-medium text-sm
              flex items-center gap-2
              ${isActive(item.href) ? activeClasses : baseClasses}
            `}
          >
            {item.icon && <span className={`fa fa-${item.icon}`} />}
            <span>{item.label}</span>
            {item.badge && (
              <span
                className="
                px-2 py-0.5 rounded-full
                bg-blue-600 text-white
                text-xs font-semibold
              "
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
