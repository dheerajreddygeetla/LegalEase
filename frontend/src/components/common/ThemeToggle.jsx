import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useState } from 'react';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`relative p-2.5 rounded-xl overflow-hidden ${className}`}
      style={{
        background: hovered ? 'rgba(184,135,30,0.1)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hovered ? 'rgba(184,135,30,0.4)' : 'rgba(255,255,255,0.08)'}`,
        color: hovered ? '#D4A43A' : 'var(--text-muted)',
        boxShadow: hovered ? '0 0 18px rgba(184,135,30,0.2), inset 0 1px 0 rgba(255,255,255,0.06)' : 'none',
        transition: 'background 0.25s ease, border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {/* Shimmer sweep on hover */}
      {hovered && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)',
            borderRadius: 'inherit',
            pointerEvents: 'none',
            animation: 'shimmer-sweep 1.2s ease forwards',
          }}
        />
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -180, scale: 0.4, y: 6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
          exit={{ opacity: 0, rotate: 180, scale: 0.4, y: -6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {theme === 'light' ? (
            <Moon
              className="w-4 h-4"
              style={{ filter: hovered ? 'drop-shadow(0 0 5px rgba(184,135,30,0.8))' : 'none' }}
            />
          ) : (
            <Sun
              className="w-4 h-4"
              style={{ filter: hovered ? 'drop-shadow(0 0 5px rgba(212,164,58,0.8))' : 'none' }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
