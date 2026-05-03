'use client';

import React from 'react';

export interface TimelineItem {
  era: string;
  label: string;
  detail: string;
}

export interface VerticalTimelinePanelProps {
  eyebrow?: string;
  title?: string;
  items: TimelineItem[];
}

export const VerticalTimelinePanel: React.FC<VerticalTimelinePanelProps> = ({
  eyebrow,
  title,
  items,
}) => {
  return (
    <section className="py-20 lg:py-28 bg-hash-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-14">
            {eyebrow && (
              <p className="text-xs font-mono text-hash-primary/60 tracking-widest uppercase mb-3">{eyebrow}</p>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
            )}
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-hash-primary/20 ml-[5.5rem]" />
            <div className="space-y-12">
              {items.map((item, i) => (
                <div key={i} className="flex gap-8">
                  <div className="w-24 shrink-0 text-right">
                    <span className="text-xs font-mono text-hash-primary/60 tracking-wide">{item.era}</span>
                  </div>
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-hash-primary ring-4 ring-hash-primary/10 -translate-x-[calc(50%+0.5px)]" />
                    <h4 className="text-white font-semibold mb-1">{item.label}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
