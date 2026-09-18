import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MessageSquare, FileText, Search, User, LogOut, Scale,
  ChevronRight, LayoutDashboard, Menu, X, Bell, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageSwitcher from '../common/LanguageSwitcher';
import Background3D from '../common/Background3D';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: t('dashboard') || 'Dashboard', color: '#D4A43A' },
    { path: '/assistant', icon: MessageSquare, label: t('assistant') || 'AI Assistant', color: '#6B8FD4' },
    { path: '/documents', icon: FileText, label: t('documents') || 'Documents', color: '#52B788' },
    { path: '/schemes', icon: Search, label: t('schemes') || 'Schemes', color: '#E07A5F' },
    { path: '/profile', icon: User, label: t('profile') || 'Profile', color: '#9B7DD4' },
  ];

  const currentNav = navItems.find((item) => item.path === location.pathname) || {
    label: 'Dashboard',
    color: '#D4A43A',
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full relative">
      {/* Noise grain texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          opacity: 0.025,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Brand Logo Header */}
      <div
        className="h-[66px] px-5 flex items-center relative z-10"
        style={{ borderBottom: '1px solid rgba(42,48,74,0.7)' }}
      >
        {/* Gold shimmer top line on brand */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(212,164,58,0.5), transparent)',
          }}
        />
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div
            className="relative w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #C9A84C 0%, #DEB84C 40%, #926A14 100%)',
              boxShadow: '0 4px 20px rgba(184,135,30,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <Scale className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight block">
              Legal<span className="gold-shimmer-static">Ease</span>
            </span>
            <span
              className="text-[10px] font-bold tracking-[0.14em] uppercase"
              style={{ color: 'rgba(212,164,58,0.7)' }}
            >
              Citizen Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-6 space-y-0.5 overflow-y-auto relative z-10">
        <div
          className="px-3 pb-3 text-[10.5px] font-bold uppercase tracking-[0.16em]"
          style={{ color: 'rgba(100,116,139,0.6)' }}
        >
          Workspace
        </div>
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={{
                background: isActive
                  ? `${item.color}14`
                  : 'transparent',
                color: isActive ? item.color : 'rgba(148,163,184,0.75)',
                border: isActive ? `1px solid ${item.color}25` : '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = 'rgba(248,250,252,0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(148,163,184,0.75)';
                }
              }}
            >
              {/* Animated active bar — slides between items */}
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-bar"
                  className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full"
                  style={{ background: item.color, boxShadow: `0 0 8px ${item.color}80` }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon container */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: isActive ? `${item.color}18` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? item.color + '30' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon
                  className="w-4 h-4"
                  style={{
                    color: isActive ? item.color : 'inherit',
                    filter: isActive ? `drop-shadow(0 0 5px ${item.color}80)` : 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
              </div>

              <span className="flex-1 font-medium">{item.label}</span>

              {isActive && (
                <ChevronRight
                  className="w-3.5 h-3.5 opacity-50 flex-shrink-0"
                  style={{ color: item.color }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* User Footer Profile */}
      <div
        className="p-4 space-y-3 relative z-10"
        style={{
          borderTop: '1px solid rgba(42,48,74,0.7)',
          background: 'rgba(0,0,0,0.2)',
        }}
      >
        <Link
          to="/profile"
          className="flex items-center gap-3 p-2.5 rounded-xl group transition-all duration-200"
          style={{ background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          {/* Avatar with spinning ring */}
          <div className="relative w-9 h-9 flex-shrink-0">
            <div
              style={{
                position: 'absolute',
                inset: -2,
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #D4A43A, #926A14, #D4A43A)',
                animation: 'spin-ring 5s linear infinite',
                padding: 2,
              }}
            />
            <div
              className="absolute inset-1 rounded-full flex items-center justify-center font-bold text-xs text-white"
              style={{
                background: 'linear-gradient(135deg, #C9A84C 0%, #926A14 100%)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {/* Online dot */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#52B788',
                border: '1.5px solid rgba(8,10,18,0.9)',
                boxShadow: '0 0 6px #52B78880',
                zIndex: 2,
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-bold truncate transition-colors duration-200"
              style={{ color: 'rgba(248,250,252,0.85)' }}
            >
              {user?.name || 'Citizen User'}
            </p>
            <p className="text-[11px] truncate" style={{ color: 'rgba(100,116,139,0.7)' }}>
              {user?.email || 'citizen@legalease.in'}
            </p>
          </div>
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(100,116,139,0.5)' }} />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
          style={{
            color: 'rgba(251,113,133,0.8)',
            background: 'rgba(239,68,68,0.05)',
            border: '1px solid rgba(239,68,68,0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
            e.currentTarget.style.color = 'rgba(251,113,133,1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.05)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)';
            e.currentTarget.style.color = 'rgba(251,113,133,0.8)';
          }}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('logout') || 'Sign Out'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-transparent">
      {/* Immersive 3D perspective background */}
      <Background3D />

      {/* Desktop Fixed Sidebar */}
      <aside
        className="hidden lg:flex fixed inset-y-4 left-4 w-64 flex-col shadow-2xl z-30"
        style={{
          background: 'linear-gradient(180deg, rgba(11, 15, 26, 0.82) 0%, rgba(7, 9, 16, 0.88) 100%)',
          backdropFilter: 'blur(32px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Backdrop & Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-4 left-4 w-72 flex flex-col shadow-2xl z-50 lg:hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(11, 15, 26, 0.88) 0%, rgba(7, 9, 16, 0.92) 100%)',
                backdropFilter: 'blur(32px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '20px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              }}
            >
              <div className="absolute right-3 top-4 z-10">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-muted)',
                  }}
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area - lg:pl-72 ensures 16px clearance from w-64 fixed sidebar */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10 w-full lg:pl-72 px-4 lg:pr-6 py-4">
        {/* Top Header Bar */}
        <header
          className="sticky top-0 z-20 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 18, 32, 0.75) 0%, rgba(9, 12, 22, 0.68) 100%)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl lg:hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-muted)',
              }}
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-5 h-5" />
            </motion.button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: 'rgba(100,116,139,0.6)', fontSize: 12 }} className="hidden sm:inline">
                LegalEase
              </span>
              <span style={{ color: 'rgba(100,116,139,0.4)' }} className="hidden sm:inline">›</span>
              <span
                className="font-bold text-sm"
                style={{
                  color: currentNav.color,
                  textShadow: `0 0 20px ${currentNav.color}60`,
                }}
              >
                {currentNav.label}
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 w-full max-w-7xl mx-auto py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="p-5 sm:p-7 lg:p-9"
              style={{
                background: 'linear-gradient(135deg, rgba(14, 18, 32, 0.55) 0%, rgba(8, 11, 20, 0.45) 100%)',
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
                minHeight: 'calc(100vh - 120px)',
              }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
