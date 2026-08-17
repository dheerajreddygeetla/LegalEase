import React from 'react';

const LABELS = { low: 'Low risk', medium: 'Medium risk', high: 'High risk' };

const RiskBadge = ({ level = 'low' }) => (
  <span className={`badge-risk-${level}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {LABELS[level]}
  </span>
);

export default RiskBadge;
