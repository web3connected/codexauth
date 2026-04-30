import React from "react";

interface GlobalHeaderProps {
  // Top bar widget slots (4 total)
  topWidget1?: React.ReactNode;
  topWidget2?: React.ReactNode;
  topWidget3?: React.ReactNode;
  topWidget4?: React.ReactNode;
  
  // Bottom bar widget slots (2 total)
  bottomWidget1?: React.ReactNode;
  bottomWidget2?: React.ReactNode;
  
  className?: string;
}

/**
 * GlobalHeader - Universal two-tier header for Codex ecosystem
 * 
 * Structure:
 * - Top Bar: 40px height with 4 widget slots
 * - Bottom Bar: 100px height with 2 widget slots (typically logo + navigation)
 * 
 * Widget slots allow for flexible, CMS-driven content
 */
const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  topWidget1,
  topWidget2,
  topWidget3,
  topWidget4,
  bottomWidget1,
  bottomWidget2,
  className = "",
}) => {
  return (
    <header className={`sticky top-0 z-40 ${className}`}>
      {/* TOP BAR: 40px height, 4 widget slots - Darker (neutral-900) */}
      {(topWidget1 || topWidget2 || topWidget3 || topWidget4) && (
        <div 
          className="h-[40px] backdrop-blur-sm border-b" 
          style={{ 
            backgroundColor: 'rgb(15 23 42)', // neutral-900
            borderColor: 'rgb(51 65 85)' // neutral-700
          }}
        >
          <div className="container mx-auto px-6 h-full">
            <div className="flex justify-between items-center h-full">
              {/* Left side - 2 widget slots */}
              <div className="flex items-center gap-4">
                {topWidget1 && <div className="widget-slot">{topWidget1}</div>}
                {topWidget2 && <div className="widget-slot">{topWidget2}</div>}
              </div>

              {/* Right side - 2 widget slots */}
              <div className="flex items-center gap-4">
                {topWidget3 && <div className="widget-slot">{topWidget3}</div>}
                {topWidget4 && <div className="widget-slot">{topWidget4}</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM BAR: 100px height, 2 widget slots - Lighter (neutral-800) */}
      <div 
        className="h-[100px] backdrop-blur-sm border-b"
        style={{ 
          backgroundColor: 'rgb(30 41 59)', // neutral-800
          borderColor: 'rgb(71 85 105)' // neutral-600
        }}
      >
        <div className="container mx-auto px-6 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Left widget slot (typically logo) */}
            <div className="flex items-center">
              {bottomWidget1 && <div className="widget-slot">{bottomWidget1}</div>}
            </div>

            {/* Right widget slot (typically navigation) */}
            <div className="flex items-center">
              {bottomWidget2 && <div className="widget-slot">{bottomWidget2}</div>}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
