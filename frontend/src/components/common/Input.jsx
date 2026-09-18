import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      error = null,
      helperText = '',
      success = false,
      disabled = false,
      className = '',
      showPasswordToggle = false,
      showPassword = false,
      onTogglePassword,
      required = false,
      iconLeft = null,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    // Filter out framer-motion specific props to avoid passing them to DOM elements
    const { whileHover, whileTap, animate, initial, exit, transition, ...domProps } = props;

    const state = error ? 'error' : success && !error ? 'success' : focused ? 'focused' : 'idle';

    const borderColors = {
      idle:    'rgba(42,48,74,0.8)',
      focused: 'rgba(184,135,30,0.65)',
      success: 'rgba(82,183,136,0.65)',
      error:   'rgba(176,58,46,0.7)',
    };

    const shadowColors = {
      idle:    'none',
      focused: '0 0 0 3px rgba(184,135,30,0.14), 0 4px 16px rgba(0,0,0,0.12)',
      success: '0 0 0 3px rgba(82,183,136,0.14)',
      error:   '0 0 0 3px rgba(176,58,46,0.14)',
    };

    const labelColors = {
      idle:    'var(--text-secondary)',
      focused: 'var(--accent-gold)',
      success: '#52B788',
      error:   '#B03A2E',
    };

    const paddingLeft = iconLeft ? '40px' : '14px';
    const paddingRight = (showPasswordToggle || success || error) ? '40px' : '14px';

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <motion.label
            className="block text-[11px] uppercase tracking-wider font-bold mb-2"
            animate={{ color: labelColors[state] }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {required && (
              <span className="ml-1" style={{ color: '#B03A2E' }}>
                *
              </span>
            )}
          </motion.label>
        )}

        <div className="relative group">
          {/* Left icon */}
          {iconLeft && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                color: focused ? 'var(--accent-gold)' : 'var(--text-muted)',
                transition: 'color 0.2s ease',
                zIndex: 2,
              }}
            >
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            type={showPassword ? 'text' : type}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: '100%',
              paddingTop: '10px',
              paddingBottom: '10px',
              paddingLeft,
              paddingRight,
              borderRadius: '12px',
              border: `1px solid ${borderColors[state]}`,
              background: focused
                ? 'rgba(255,255,255,0.07)'
                : 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              outline: 'none',
              boxShadow: shadowColors[state],
              transition: 'all 0.25s cubic-bezier(0.23, 1, 0.32, 1)',
              opacity: disabled ? 0.45 : 1,
              cursor: disabled ? 'not-allowed' : 'text',
              position: 'relative',
              zIndex: 1,
            }}
            {...domProps}
          />

          {/* Animated bottom focus line */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '10%',
              right: '10%',
              height: '2px',
              borderRadius: '0 0 12px 12px',
              background: state === 'error'
                ? 'linear-gradient(90deg, transparent, rgba(176,58,46,0.8), transparent)'
                : state === 'success'
                ? 'linear-gradient(90deg, transparent, rgba(82,183,136,0.8), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(184,135,30,0.8), transparent)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: focused || error || success ? 1 : 0,
              opacity: focused || error || success ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Right icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
            {showPasswordToggle && (
              <motion.button
                type="button"
                onClick={onTogglePassword}
                disabled={disabled}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="p-0.5 rounded transition-colors duration-200"
                style={{ color: focused ? 'var(--accent-gold)' : 'var(--text-muted)' }}
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />
                }
              </motion.button>
            )}

            <AnimatePresence mode="wait">
              {success && !error && !showPasswordToggle && (
                <motion.div
                  key="success"
                  initial={{ scale: 0, rotate: -45, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <CheckCircle2
                    className="w-4 h-4"
                    style={{
                      color: '#52B788',
                      filter: 'drop-shadow(0 0 4px rgba(82,183,136,0.6))',
                    }}
                  />
                </motion.div>
              )}
              {error && (
                <motion.div
                  key="error"
                  initial={{ scale: 0, rotate: 45, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
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
        </div>

        {/* Error / helper messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error-msg"
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
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

Input.displayName = 'Input';

export default Input;
