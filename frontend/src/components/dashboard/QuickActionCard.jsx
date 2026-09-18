import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

const colorMap = {
  brand:   { bg: 'rgba(184,135,30,0.10)',  border: 'rgba(184,135,30,0.22)',  icon: '#D4A43A', glow: 'rgba(184,135,30,0.20)' },
  primary: { bg: 'rgba(107,143,212,0.10)', border: 'rgba(107,143,212,0.22)', icon: '#6B8FD4', glow: 'rgba(107,143,212,0.20)' },
  success: { bg: 'rgba(26,122,82,0.10)',   border: 'rgba(26,122,82,0.22)',   icon: '#22A870', glow: 'rgba(26,122,82,0.20)' },
  danger:  { bg: 'rgba(176,58,46,0.10)',   border: 'rgba(176,58,46,0.22)',   icon: '#E87060', glow: 'rgba(176,58,46,0.20)' },
};

const QuickActionCard = ({ title, description, icon: Icon, link, color = 'brand', delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const colors = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: '1000px', height: '100%' }}
    >
      <Link to={link} className="block h-full">
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          animate={hovered ? { rotateY: -4, rotateX: 3, y: -8 } : { rotateY: 0, rotateX: 0, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: hovered
              ? 'linear-gradient(135deg, rgba(24, 31, 54, 0.78) 0%, rgba(15, 20, 36, 0.68) 100%)'
              : 'linear-gradient(135deg, rgba(18, 23, 40, 0.62) 0%, rgba(11, 15, 26, 0.52) 100%)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: hovered ? `1px solid ${colors.border}` : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: hovered
              ? `0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px ${colors.border}, 0 8px 24px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.16)`
              : '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
            transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            zIndex: hovered ? 10 : 1,
          }}
        >
          {/* Background shimmer on hover */}
          <motion.div
            animate={hovered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at 20% 20%, ${colors.glow} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Icon */}
          <motion.div
            animate={hovered ? { scale: 1.12, y: -2 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              flexShrink: 0,
              boxShadow: hovered ? `0 0 20px ${colors.glow}` : 'none',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            <Icon style={{ width: 22, height: 22, color: colors.icon }} />
          </motion.div>

          {/* Content */}
          <h3
            className="font-semibold mb-2 text-sm"
            style={{
              color: 'var(--text-primary)',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
          <p className="text-xs mb-5 leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>

          {/* CTA */}
          <div
            className="flex items-center gap-1.5 text-xs font-semibold mt-auto"
            style={{ color: colors.icon }}
          >
            Get Started
            <motion.span
              animate={hovered ? { x: 4 } : { x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ArrowRight style={{ width: 13, height: 13 }} />
            </motion.span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default QuickActionCard;
