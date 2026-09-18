import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  size = 'md',
  showCloseButton = true,
  className = '',
}) => {
  const sizes = {
    sm: '440px',
    md: '560px',
    lg: '720px',
    xl: '960px',
    full: '1200px',
  };

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0"
            style={{
              background: 'rgba(4, 5, 9, 0.82)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          />

          {/* Modal dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex flex-col max-h-[90vh] w-full z-10 ${className}`}
            style={{
              maxWidth: sizes[size],
              background: 'rgba(10, 13, 22, 0.98)',
              border: '1px solid rgba(42,48,74,0.9)',
              borderRadius: 20,
              backdropFilter: 'blur(32px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(32px) saturate(1.3)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.75), 0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gold shimmer top border */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '8%',
                right: '8%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(212,164,58,0.6), rgba(232,192,92,0.8), rgba(212,164,58,0.6), transparent)',
                pointerEvents: 'none',
              }}
            />

            {/* Ambient glow */}
            <div
              style={{
                position: 'absolute',
                top: -80,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 300,
                height: 200,
                background: 'radial-gradient(ellipse, rgba(184,135,30,0.12) 0%, transparent 70%)',
                filter: 'blur(30px)',
                pointerEvents: 'none',
              }}
            />

            {/* Header */}
            {title && (
              <div
                className="flex items-center justify-between px-6 py-4 relative z-10"
                style={{ borderBottom: '1px solid rgba(42,48,74,0.7)' }}
              >
                <h2
                  className="text-base font-bold tracking-tight text-white"
                >
                  {title}
                </h2>
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="p-1.5 rounded-xl text-gray-400 hover:text-white"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 relative z-10">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div
                className="flex items-center justify-end gap-3 px-6 py-4 relative z-10"
                style={{ borderTop: '1px solid rgba(42,48,74,0.7)' }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
