import { motion } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';

const Card = ({
  children,
  variant = 'default',
  shadow = 'soft',
  padding = 'normal',
  radius = 'xl',
  className = '',
  hover = false,
  tilt = false,
  specular = true,
  glowColor = null,
  onClick,
  style = {},
  ...props
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [specularPos, setSpecularPos] = useState({ x: 50, y: 50 });

  // Filter out framer-motion specific props to avoid passing them to DOM elements
  const { whileHover, whileTap, animate, initial, exit, transition, ...domProps } = props;

  const variantStyles = {
    default: {
      background: 'linear-gradient(135deg, rgba(20, 26, 46, 0.65) 0%, rgba(12, 16, 30, 0.55) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    },
    glass: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.05) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.20)',
      backdropFilter: 'blur(28px) saturate(190%)',
      WebkitBackdropFilter: 'blur(28px) saturate(190%)',
    },
    'glass-dark': {
      background: 'linear-gradient(135deg, rgba(16, 21, 38, 0.68) 0%, rgba(10, 13, 24, 0.58) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
    },
    'glass-strong': {
      background: 'linear-gradient(135deg, rgba(22, 28, 50, 0.70) 0%, rgba(13, 17, 32, 0.60) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(30px) saturate(190%)',
      WebkitBackdropFilter: 'blur(30px) saturate(190%)',
    },
    elevated: {
      background: 'linear-gradient(135deg, rgba(24, 31, 54, 0.72) 0%, rgba(15, 19, 36, 0.62) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
    },
    dark: {
      background: 'linear-gradient(135deg, rgba(14, 18, 32, 0.75) 0%, rgba(9, 12, 22, 0.65) 100%)',
      border: '1px solid rgba(42, 48, 74, 0.8)',
      backdropFilter: 'blur(24px) saturate(170%)',
      WebkitBackdropFilter: 'blur(24px) saturate(170%)',
    },
    premium: {
      background: 'linear-gradient(135deg, rgba(22, 28, 50, 0.70) 0%, rgba(13, 17, 32, 0.60) 100%)',
      border: '1px solid rgba(212, 164, 58, 0.30)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
    },
    glow: {
      background: 'linear-gradient(135deg, rgba(24, 30, 52, 0.72) 0%, rgba(14, 18, 34, 0.62) 100%)',
      border: '1px solid rgba(212, 164, 58, 0.38)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
    },
    hover: {
      background: 'linear-gradient(135deg, rgba(20, 26, 46, 0.65) 0%, rgba(12, 16, 28, 0.52) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    },
  };

  const shadowStyles = {
    none: {},
    soft: { boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)' },
    elevated: { boxShadow: '0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' },
    deep: { boxShadow: '0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)' },
    glow: { boxShadow: `0 0 32px ${glowColor ? glowColor + '40' : 'rgba(212,164,58,0.25)'}, 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)` },
    md: { boxShadow: '0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.10)' },
  };

  const paddingStyles = {
    none: '0',
    sm: '12px',
    normal: '20px',
    lg: '28px',
    xl: '36px',
  };

  const radiusStyles = {
    none: '0',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '28px',
    full: '9999px',
  };

  // Specular highlight handler (tilt completely removed per user instruction)
  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (specular) {
      const pctX = (x / rect.width) * 100;
      const pctY = (y / rect.height) * 100;
      setSpecularPos({ x: pctX, y: pctY });
    }
  }, [specular]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (specular) setIsHovered(true);
  }, [specular]);

  const mergedStyle = {
    position: 'relative',
    overflow: 'hidden',
    transformStyle: 'preserve-3d',
    ...variantStyles[variant],
    ...shadowStyles[shadow],
    padding: paddingStyles[padding],
    borderRadius: radiusStyles[radius],
    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
    willChange: hover ? 'transform, box-shadow' : undefined,
    ...(onClick ? { cursor: 'pointer' } : {}),
    ...style,
  };

  const CardTag = hover || onClick ? motion.div : 'div';

  // Build props based on whether we're using motion.div or regular div
  const commonProps = {
    onClick,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    style: mergedStyle,
    className,
  };

  const motionSpecificProps = {
    whileHover: hover
      ? {
          y: -6,
          scale: 1.01,
          boxShadow: glowColor
            ? `0 20px 50px ${glowColor}30, 0 8px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)`
            : '0 20px 50px rgba(0,0,0,0.35), 0 0 24px rgba(212,164,58,0.15), inset 0 1px 0 rgba(255,255,255,0.12)',
          transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
        }
      : undefined,
  };

  // Combine props appropriately based on component type
  const finalProps = (hover || onClick) 
    ? { ...commonProps, ...motionSpecificProps, ...domProps }
    : { ...commonProps, ...domProps };

  return (
    <CardTag
      ref={cardRef}
      {...finalProps}
    >
      {/* Specular cursor-follow highlight */}
      {specular && isHovered && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            background: `radial-gradient(circle 180px at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.07) 0%, transparent 70%)`,
            zIndex: 0,
            transition: 'background 0.04s ease',
          }}
        />
      )}

      {/* Premium noise grain texture */}
      {variant === 'premium' && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            opacity: 0.025,
            zIndex: 0,
          }}
        />
      )}

      {/* Gold top-shimmer inset line */}
      {(variant === 'premium' || variant === 'glow') && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(212,164,58,0.6), transparent)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </CardTag>
  );
};

export default Card;
