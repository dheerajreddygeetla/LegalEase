const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 20,
    md: 36,
    lg: 56,
  };

  const px = sizes[size] ?? sizes.md;
  const stroke = size === 'sm' ? 2 : 2.5;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 50 50"
        style={{ display: 'block' }}
      >
        {/* Outer track */}
        <circle
          cx="25" cy="25" r="20"
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={stroke}
        />
        {/* Spinning arc */}
        <circle
          cx="25" cy="25" r="20"
          fill="none"
          stroke="url(#spinner-gold)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray="80 45"
          style={{
            transformOrigin: '25px 25px',
            animation: 'spin-ring 0.9s cubic-bezier(0.5, 0, 0.5, 1) infinite',
          }}
        />
        {/* Inner spinning arc (opposite direction) */}
        <circle
          cx="25" cy="25" r="13"
          fill="none"
          stroke="rgba(184,135,30,0.25)"
          strokeWidth={stroke * 0.7}
          strokeLinecap="round"
          strokeDasharray="40 42"
          style={{
            transformOrigin: '25px 25px',
            animation: 'spin-ring 1.3s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse',
          }}
        />
        <defs>
          <linearGradient id="spinner-gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#926A14" />
            <stop offset="50%" stopColor="#D4A43A" />
            <stop offset="100%" stopColor="#E8C05C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
