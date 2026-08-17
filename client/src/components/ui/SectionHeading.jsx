import React from 'react';

const SectionHeading = ({ kicker, title, description, align = 'center' }) => {
  const alignClass = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';
  return (
    <div className={`flex flex-col gap-4 max-w-2xl ${alignClass}`}>
      {kicker && <span className="kicker">{kicker}</span>}
      <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink">
        {title}
      </h2>
      {description && (
        <p className="text-ink-dim text-base leading-relaxed">{description}</p>
      )}
    </div>
  );
};

export default SectionHeading;
