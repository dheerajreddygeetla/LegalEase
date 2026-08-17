import React from 'react';

/**
 * Small holographic panel used around the hero's 3D document — CSS-only
 * float animation, positioned absolutely by the parent via `style`.
 */
const FloatingCard = ({ icon: Icon, label, sub, delay = '0s', className = '', style = {} }) => (
  <div
    className={`glass-panel px-4 py-3 flex items-center gap-3 shadow-float animate-float-slow ${className}`}
    style={{ animationDelay: delay, ...style }}
  >
    {Icon && (
      <div className="w-8 h-8 rounded-lg bg-grad-primary flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-white" strokeWidth={2} />
      </div>
    )}
    <div className="min-w-0">
      <p className="text-xs font-semibold text-ink whitespace-nowrap">{label}</p>
      {sub && <p className="text-[11px] text-ink-dim">{sub}</p>}
    </div>
  </div>
);

export default FloatingCard;
