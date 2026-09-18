import { motion } from 'framer-motion';
import { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const colorMap = {
  brand:   { bg: 'rgba(184,135,30,0.12)',  border: 'rgba(184,135,30,0.25)',  icon: '#D4A43A', glow: 'rgba(184,135,30,0.25)' },
  primary: { bg: 'rgba(107,143,212,0.12)', border: 'rgba(107,143,212,0.25)', icon: '#6B8FD4', glow: 'rgba(107,143,212,0.25)' },
  success: { bg: 'rgba(26,122,82,0.12)',   border: 'rgba(26,122,82,0.25)',   icon: '#22A870', glow: 'rgba(26,122,82,0.25)' },
  danger:  { bg: 'rgba(176,58,46,0.12)',   border: 'rgba(176,58,46,0.25)',   icon: '#E87060', glow: 'rgba(176,58,46,0.25)' },
};

const StatCard = ({ label, value, icon: Icon, color = 'brand', isLoading, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const colors = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={hovered ? { rotateY: -3, rotateX: 2, y: -6 } : { rotateY: 0, rotateX: 0, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          background: hovered
            ? 'linear-gradient(135deg, rgba(24, 31, 54, 0.78) 0%, rgba(15, 20, 36, 0.68) 100%)'
            : 'linear-gradient(135deg, rgba(18, 23, 40, 0.62) 0%, rgba(11, 15, 26, 0.52) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: hovered ? `1px solid ${colors.border}` : '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '22px',
          boxShadow: hovered
            ? `0 20px 56px rgba(0,0,0,0.4), 0 0 0 1px ${colors.border}, 0 8px 24px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.16)`
            : '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
          transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          overflow: 'hidden',
          position: 'relative',
          zIndex: hovered ? 10 : 1,
        }}
      >
        {/* Gold shimmer top line */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
          background: `linear-gradient(90deg, transparent, ${colors.icon}60, transparent)`,
          opacity: hovered ? 1 : 0.3, transition: 'opacity 0.3s ease', pointerEvents: 'none',
        }} />
        <div className="flex items-center gap-4">
          {/* Icon bubble */}
          <motion.div
            animate={hovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: hovered ? `0 0 16px ${colors.glow}` : 'none',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            <Icon style={{ width: 22, height: 22, color: colors.icon }} />
          </motion.div>

          <div>
            <div
              className="text-2xl font-bold"
              style={{ color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : value}
            </div>
            <div className="text-xs mt-0.5 uppercase tracking-wide font-medium" style={{ color: 'var(--text-muted)' }}>
              {label}
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <motion.div
          animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            height: 2,
            marginTop: 16,
            borderRadius: 1,
            background: `linear-gradient(90deg, ${colors.icon}00, ${colors.icon}, ${colors.icon}00)`,
            transformOrigin: 'left',
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default StatCard;
