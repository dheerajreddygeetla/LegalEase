import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Scale, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';
import Button from './Button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setScrolled(y > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const publicNavItems = [
    { path: '/', label: t('home') || 'Home' },
    { path: '/help', label: t('help') || 'Help' },
  ];

  const authNavItems = [
    { path: '/dashboard', label: t('dashboard') || 'Dashboard' },
    { path: '/assistant', label: t('assistant') || 'AI Assistant' },
    { path: '/documents', label: t('documents') || 'Documents' },
    { path: '/schemes', label: t('schemes') || 'Schemes' },
  ];

  const navItems = isAuthenticated ? authNavItems : publicNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Interpolated header styles based on scroll
  const scrollProgress = Math.min(scrollY / 80, 1);

  const headerBg = scrolled
    ? 'rgba(8, 10, 15, 0.92)'
    : 'transparent';

  return (
    <header ref={headerRef} className="sticky top-3 sm:top-5 z-40 w-full px-4 sm:px-6 max-w-7xl mx-auto transition-all duration-300">
      <motion.div
        animate={{
          scale: scrolled ? 0.99 : 1,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-full px-4 sm:px-6 py-2 sm:py-2.5 relative transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(8, 11, 22, 0.84)' : 'rgba(12, 16, 30, 0.72)',
          backdropFilter: 'blur(36px) saturate(190%)',
          WebkitBackdropFilter: 'blur(36px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: scrolled
            ? '0 24px 60px rgba(0,0,0,0.6), 0 0 28px rgba(212,164,58,0.18), inset 0 1.5px 1px rgba(255,255,255,0.35), inset 0 -1px 1px rgba(212,164,58,0.15)'
            : '0 16px 40px rgba(0,0,0,0.45), inset 0 1.5px 1px rgba(255,255,255,0.28), inset 0 -1px 1px rgba(212,164,58,0.1)',
        }}
      >
        {/* Shimmer border top for 3D glass edge light */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(212,164,58,0.7), rgba(255,255,255,0.9), rgba(212,164,58,0.7), transparent)',
            pointerEvents: 'none',
          }}
        />

        <div className="w-full">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-9 h-9">
                {/* Glow ring on hover */}
                <motion.span
                  className="absolute inset-0 rounded-xl"
                  initial={{ opacity: 0, scale: 1 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    background: 'rgba(212,164,58,0.3)',
                    filter: 'blur(8px)',
                    transform: 'scale(1.3)',
                  }}
                />
                <motion.div
                  className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{
                    background: 'linear-gradient(135deg, #C9A84C 0%, #DEB84C 40%, #926A14 100%)',
                    boxShadow: '0 4px 20px rgba(184,135,30,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  <Scale className="w-4.5 h-4.5 text-white" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
                </motion.div>
              </div>
              <span
                className="text-xl font-bold tracking-tight font-sans"
                style={{ color: 'var(--text-primary)' }}
              >
                Legal<span className="gold-shimmer-static">Ease</span>
              </span>
            </Link>

            {/* Desktop Navigation Capsule */}
            <nav
              className="hidden md:flex items-center gap-0.5 px-2 py-1.5 rounded-full"
              style={{
                background: scrolled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200"
                    style={{
                      color: isActive ? '#D4A43A' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 500,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="header-active-pill"
                        className="absolute inset-0 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        style={{
                          background: 'linear-gradient(135deg, rgba(212,164,58,0.15) 0%, rgba(212,164,58,0.08) 100%)',
                          border: '1px solid rgba(212,164,58,0.25)',
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls & Auth CTAs */}
            <div className="hidden md:flex items-center gap-2.5">
              <LanguageSwitcher />

              {isAuthenticated ? (
                <div className="flex items-center gap-2 pl-1">
                  <Link to="/profile">
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2.5 px-3 py-1.5 rounded-full cursor-pointer"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(212,164,58,0.4)';
                        e.currentTarget.style.background = 'rgba(212,164,58,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #C9A84C 0%, #926A14 100%)',
                          boxShadow: '0 2px 8px rgba(184,135,30,0.35)',
                        }}
                      >
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-xs font-semibold max-w-[100px] truncate" style={{ color: 'var(--text-primary)' }}>
                        {user?.name?.split(' ')[0] || 'Profile'}
                      </span>
                    </motion.div>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    {t('logout') || 'Sign Out'}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 pl-1">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      {t('login') || 'Sign In'}
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm" iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
                      {t('register') || 'Get Started'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.92 }}
                className="p-2 rounded-xl transition-colors duration-200"
                style={{
                  background: mobileMenuOpen ? 'rgba(212,164,58,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${mobileMenuOpen ? 'rgba(212,164,58,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: mobileMenuOpen ? '#D4A43A' : 'var(--text-secondary)',
                }}
                aria-label="Toggle navigation menu"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden mt-2.5 rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(10, 14, 26, 0.88)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              backdropFilter: 'blur(36px) saturate(180%)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.25)',
            }}
          >
            <div className="max-w-7xl mx-auto px-4 py-5 space-y-3">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item, i) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                        style={{
                          background: isActive ? 'rgba(212,164,58,0.1)' : 'transparent',
                          color: isActive ? '#D4A43A' : 'var(--text-secondary)',
                          border: isActive ? '1px solid rgba(212,164,58,0.2)' : '1px solid transparent',
                          fontWeight: isActive ? 600 : 500,
                        }}
                      >
                        {isActive && (
                          <span
                            style={{
                              width: 3,
                              height: 16,
                              borderRadius: 2,
                              background: '#D4A43A',
                              boxShadow: '0 0 8px rgba(212,164,58,0.6)',
                              flexShrink: 0,
                            }}
                          />
                        )}
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div
                className="pt-3 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(42,48,74,0.6)' }}
              >
                <LanguageSwitcher />
                {isAuthenticated ? (
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    {t('logout') || 'Sign Out'}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm">{t('login') || 'Sign In'}</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" size="sm">{t('register') || 'Register'}</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
