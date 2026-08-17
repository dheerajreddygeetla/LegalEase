import React from 'react';

/**
 * Base elevated surface used across the app: dashboard cards, feature cards,
 * document panels. `lift` adds the signature hover-toward-user 3D tilt.
 */
const GlassCard = ({ as: Tag = 'div', lift = false, className = '', children, ...rest }) => {
  return (
    <Tag
      className={`glass-card p-6 ${lift ? 'transition-all duration-300 hover:-translate-y-1.5 hover:border-border-hi hover:shadow-glow' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default GlassCard;
