import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useRef } from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  // Filter out framer-motion specific props to avoid passing them to DOM elements
  const { whileHover, whileTap, animate, initial, exit, transition, ...domProps } = props;
  const btnRef = useRef(null);

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: '12px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'all 0.28s cubic-bezier(0.23, 1, 0.32, 1)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.5 : 1,
    border: 'none',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    willChange: 'transform',
    letterSpacing: '0.01em',
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #E2BF5C 0%, #F5E2A8 30%, #D4A43A 70%, #B8871E 100%)',
      color: '#0A0D14',
      fontWeight: 700,
      boxShadow: '0 4px 20px rgba(212,164,58,0.4), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)',
    },
    secondary: {
      background: 'rgba(255,255,255,0.06)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
      backdropFilter: 'blur(12px)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
    danger: {
      background: 'linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)',
      color: 'white',
      boxShadow: '0 4px 16px rgba(192,57,43,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
    },
    success: {
      background: 'linear-gradient(135deg, #1A7A52 0%, #229954 100%)',
      color: 'white',
      boxShadow: '0 4px 16px rgba(26,122,82,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
    },
    accent: {
      background: 'rgba(184,135,30,0.12)',
      color: 'var(--accent-gold)',
      border: '1px solid rgba(184,135,30,0.3)',
    },
    glow: {
      background: 'rgba(212,164,58,0.08)',
      color: 'var(--accent-gold)',
      border: '1px solid rgba(212,164,58,0.3)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 0 20px rgba(212,164,58,0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
      backdropFilter: 'blur(8px)',
    },
  };

  const sizeStyles = {
    sm: { padding: '7px 16px', fontSize: '13px', gap: '6px', borderRadius: '10px' },
    md: { padding: '10px 22px', fontSize: '14px' },
    lg: { padding: '13px 30px', fontSize: '15px', gap: '10px', borderRadius: '14px' },
    xl: { padding: '16px 36px', fontSize: '16px', gap: '12px', borderRadius: '16px' },
  };

  const mergedStyle = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(fullWidth ? { width: '100%' } : {}),
  };

  // Ripple effect handler
  const handleClick = (e) => {
    if (disabled || loading) return;

    const btn = btnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        border-radius: 50%;
        background: ${variant === 'primary' ? 'rgba(255,255,255,0.25)' : 'rgba(212,164,58,0.2)'};
        transform: scale(0);
        animation: ripple-expand 0.6s linear forwards;
        pointer-events: none;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    }

    onClick?.(e);
  };

  const hoverProps = {
    primary: {
      scale: 1.02,
      boxShadow: '0 8px 32px rgba(184,135,30,0.5), 0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.25)',
    },
    secondary: {
      scale: 1.02,
      boxShadow: '0 8px 24px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.06)',
    },
    ghost: { scale: 1.02 },
    glow: {
      scale: 1.02,
      boxShadow: '0 0 30px rgba(212,164,58,0.35), 0 8px 24px rgba(0,0,0,0.12)',
    },
    danger: {
      scale: 1.02,
      boxShadow: '0 8px 24px rgba(192,57,43,0.5)',
    },
    success: {
      scale: 1.02,
      boxShadow: '0 8px 24px rgba(26,122,82,0.5)',
    },
    accent: { scale: 1.02 },
    outline: { scale: 1.02 },
  };

  return (
    <motion.button
      ref={btnRef}
      whileTap={{ scale: disabled || loading ? 1 : 0.96, y: disabled || loading ? 0 : 1 }}
      whileHover={
        disabled || loading ? {} : (whileHover || hoverProps[variant] || { scale: 1.02 })
      }
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      style={mergedStyle}
      className={className}
      {...domProps}
    >
      {/* Primary shimmer sweep */}
      {variant === 'primary' && !disabled && !loading && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3.5s linear infinite',
          }}
        />
      )}

      {/* Glow variant pulse border */}
      {variant === 'glow' && !disabled && !loading && (
        <span
          style={{
            position: 'absolute',
            inset: -2,
            borderRadius: 'inherit',
            border: '1px solid rgba(212,164,58,0.2)',
            animation: 'glow-pulse-ring 2.5s ease-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Orbital loading spinner */}
      {loading && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.15)',
              borderTopColor: 'rgba(255,255,255,0.8)',
              animation: 'spin-ring 0.7s linear infinite',
              display: 'block',
            }}
          />
        </span>
      )}

      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          position: 'relative',
          zIndex: 2,
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.2s ease',
        }}
      >
        {iconLeft && <span style={{ flexShrink: 0 }}>{iconLeft}</span>}
        <span>{children}</span>
        {iconRight && <span style={{ flexShrink: 0 }}>{iconRight}</span>}
      </span>
    </motion.button>
  );
};

export default Button;
