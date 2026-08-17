import React from 'react';
import GlassCard from './GlassCard';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <GlassCard lift className="group">
      <div className="relative w-11 h-11 rounded-xl bg-grad-primary flex items-center justify-center mb-5 shadow-glow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink-dim leading-relaxed">{description}</p>
    </GlassCard>
  );
};

export default FeatureCard;
