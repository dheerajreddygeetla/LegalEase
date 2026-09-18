import { motion } from 'framer-motion';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: {
      background: 'rgba(255,255,255,0.07)',
      color: 'rgba(148,163,184,0.9)',
      border: '1px solid rgba(255,255,255,0.1)',
      dotColor: 'rgba(148,163,184,0.7)',
    },
    secondary: {
      background: 'rgba(255,255,255,0.06)',
      color: 'rgba(148,163,184,0.8)',
      border: '1px solid rgba(255,255,255,0.09)',
      dotColor: 'rgba(148,163,184,0.6)',
    },
    outline: {
      background: 'transparent',
      color: 'rgba(148,163,184,0.85)',
      border: '1px solid rgba(42,48,74,0.8)',
      dotColor: 'rgba(148,163,184,0.6)',
    },
    primary: {
      background: 'rgba(184,135,30,0.1)',
      color: '#D4A43A',
      border: '1px solid rgba(184,135,30,0.25)',
      dotColor: '#D4A43A',
    },
    success: {
      background: 'rgba(82,183,136,0.1)',
      color: '#52B788',
      border: '1px solid rgba(82,183,136,0.25)',
      dotColor: '#52B788',
    },
    warning: {
      background: 'rgba(251,191,36,0.1)',
      color: '#FBBF24',
      border: '1px solid rgba(251,191,36,0.25)',
      dotColor: '#FBBF24',
    },
    danger: {
      background: 'rgba(239,68,68,0.1)',
      color: 'rgba(251,113,133,0.9)',
      border: '1px solid rgba(239,68,68,0.25)',
      dotColor: '#FB7185',
    },
    info: {
      background: 'rgba(107,143,212,0.1)',
      color: '#6B8FD4',
      border: '1px solid rgba(107,143,212,0.25)',
      dotColor: '#6B8FD4',
    },
    gold: {
      background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(146,106,20,0.08) 100%)',
      color: '#D4A43A',
      border: '1px solid rgba(212,164,58,0.3)',
      dotColor: '#D4A43A',
      boxShadow: '0 0 12px rgba(212,164,58,0.12), inset 0 1px 0 rgba(255,255,255,0.04)',
    },
  };

  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '10.5px', gap: 4, dotSize: 5 },
    md: { padding: '3px 10px', fontSize: '12px', gap: 5, dotSize: 6 },
    lg: { padding: '5px 14px', fontSize: '13px', gap: 6, dotSize: 7 },
  };

  const vs = variantStyles[variant] || variantStyles.default;
  const ss = sizeStyles[size] || sizeStyles.md;

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`inline-flex items-center font-semibold rounded-full ${className}`}
      style={{
        padding: ss.padding,
        fontSize: ss.fontSize,
        gap: ss.gap,
        background: vs.background,
        color: vs.color,
        border: vs.border,
        boxShadow: vs.boxShadow || 'none',
        backdropFilter: 'blur(8px)',
        letterSpacing: '0.01em',
      }}
      {...props}
    >
      {dot && (
        <span
          style={{
            width: ss.dotSize,
            height: ss.dotSize,
            borderRadius: '50%',
            background: vs.dotColor,
            flexShrink: 0,
            display: 'inline-block',
            boxShadow: `0 0 ${ss.dotSize * 2}px ${vs.dotColor}90`,
            animation: pulse ? 'pulse-ring 2s ease-in-out infinite' : 'none',
          }}
        />
      )}
      {children}
    </motion.span>
  );
};

export default Badge;
