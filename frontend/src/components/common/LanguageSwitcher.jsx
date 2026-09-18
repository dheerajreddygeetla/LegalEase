import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const LanguageSwitcher = ({ className = '' }) => {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLabel = languages[currentLanguage] || currentLanguage;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Select language"
        aria-expanded={open}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
        style={{
          background: open || hovered ? 'rgba(184,135,30,0.1)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${open ? 'rgba(184,135,30,0.45)' : hovered ? 'rgba(184,135,30,0.3)' : 'rgba(255,255,255,0.08)'}`,
          color: open || hovered ? '#D4A43A' : 'var(--text-muted)',
          boxShadow: open ? '0 0 20px rgba(184,135,30,0.18), inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.25s cubic-bezier(0.23, 1, 0.32, 1)',
          minWidth: 80,
        }}
      >
        <Globe
          className="w-3.5 h-3.5 flex-shrink-0"
          style={{
            filter: (open || hovered) ? 'drop-shadow(0 0 4px rgba(212,164,58,0.7))' : 'none',
            transition: 'filter 0.25s ease',
          }}
        />
        <span className="truncate max-w-[56px]">{currentLabel}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ flexShrink: 0 }}
        >
          <ChevronDown className="w-3 h-3" />
        </motion.div>
      </motion.button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2 min-w-[140px] z-50"
            style={{
              background: 'rgba(10, 13, 22, 0.97)',
              border: '1px solid rgba(42,48,74,0.8)',
              borderRadius: 14,
              backdropFilter: 'blur(28px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
              overflow: 'hidden',
            }}
          >
            {/* Top gold shimmer line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(212,164,58,0.6), transparent)',
                pointerEvents: 'none',
              }}
            />

            <div className="p-1.5">
              {Object.entries(languages).map(([code, name], i) => {
                const isActive = code === currentLanguage;
                return (
                  <motion.button
                    key={code}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => {
                      setLanguage(code);
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left"
                    style={{
                      background: isActive ? 'rgba(212,164,58,0.12)' : 'transparent',
                      color: isActive ? '#D4A43A' : 'rgba(148,163,184,0.85)',
                      border: `1px solid ${isActive ? 'rgba(212,164,58,0.2)' : 'transparent'}`,
                      transition: 'all 0.18s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.color = 'rgba(248,250,252,0.9)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(148,163,184,0.85)';
                      }
                    }}
                  >
                    <span>{name}</span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        <Check
                          className="w-3 h-3 flex-shrink-0"
                          style={{ color: '#D4A43A', filter: 'drop-shadow(0 0 4px rgba(212,164,58,0.6))' }}
                        />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
