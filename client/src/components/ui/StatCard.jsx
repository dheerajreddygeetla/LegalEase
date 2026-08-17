import React from 'react';
import GlassCard from './GlassCard';

const StatCard = ({ icon: Icon, label, value, trend }) => {
  return (
    <GlassCard className="flex items-center gap-4">
      {Icon && (
        <div className="w-11 h-11 shrink-0 rounded-xl bg-white/[0.04] border border-border flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue" strokeWidth={1.75} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-2xl font-display font-bold text-ink leading-none mb-1.5">{value}</p>
        <p className="text-xs text-ink-dim truncate">{label}</p>
      </div>
      {trend && (
        <span className="ml-auto text-xs font-semibold text-risk-low">{trend}</span>
      )}
    </GlassCard>
  );
};

export default StatCard;
