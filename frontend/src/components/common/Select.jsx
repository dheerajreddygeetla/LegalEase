import { forwardRef, useState } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Select = forwardRef(
  (
    {
      label,
      options = [],
      error = null,
      helperText = '',
      disabled = false,
      className = '',
      required = false,
      placeholder = 'Select an option',
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    // Filter out framer-motion specific props to avoid passing them to DOM elements
    const { whileHover, whileTap, animate, initial, exit, transition, ...domProps } = props;

    const borderColor = error
      ? 'rgba(176,58,46,0.7)'
      : focused
      ? 'rgba(184,135,30,0.65)'
      : 'rgba(42,48,74,0.8)';

    const boxShadow = error
      ? '0 0 0 3px rgba(176,58,46,0.14)'
      : focused
      ? '0 0 0 3px rgba(184,135,30,0.14), 0 4px 16px rgba(0,0,0,0.12)'
      : 'none';

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <motion.label
            className="block text-[11px] uppercase tracking-wider font-bold mb-2"
            animate={{
              color: error ? '#B03A2E' : focused ? 'var(--accent-gold)' : 'var(--text-secondary)',
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {required && <span className="ml-1" style={{ color: '#B03A2E' }}>*</span>}
          </motion.label>
        )}

        <div className="relative">
          {/* Animated focus line */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '10%',
              right: '10%',
              height: '2px',
              borderRadius: '0 0 12px 12px',
              background: error
                ? 'linear-gradient(90deg, transparent, rgba(176,58,46,0.8), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(184,135,30,0.8), transparent)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: focused ? 1 : 0, opacity: focused || error ? 1 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />

          <select
            ref={ref}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: '100%',
              padding: '10px 40px 10px 14px',
              borderRadius: '12px',
              border: `1px solid ${borderColor}`,
              background: focused ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              outline: 'none',
              boxShadow,
              transition: 'all 0.25s cubic-bezier(0.23, 1, 0.32, 1)',
              opacity: disabled ? 0.45 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
              appearance: 'none',
            }}
            {...domProps}
          >
            {placeholder && (
              <option
                value=""
                disabled
                style={{ background: '#0C0F1A', color: 'rgba(100,116,139,0.7)' }}
              >
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                style={{ background: '#0C0F1A', color: '#E8ECF5' }}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Animated chevron */}
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            animate={{
              rotate: focused ? 180 : 0,
              color: focused ? '#D4A43A' : 'var(--text-muted)',
            }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>

          {/* Error icon */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute right-10 top-1/2 -translate-y-1/2"
              >
                <AlertCircle
                  className="w-4 h-4"
                  style={{
                    color: '#B03A2E',
                    filter: 'drop-shadow(0 0 4px rgba(176,58,46,0.5))',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-xs flex items-center gap-1.5 font-medium"
              style={{ color: '#C0392B' }}
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </motion.p>
          )}
          {helperText && !error && (
            <motion.p
              key="helper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
