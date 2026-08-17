import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Scale, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import Documents from './pages/Documents';
import Schemes from './pages/Schemes';
import Profile from './pages/Profile';
import Help from './pages/Help';
import Faq from './pages/Faq';
import DashboardLayout from './components/DashboardLayout';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem('token'));
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const authedLinks = [];
  const guestLinks = [
    { to: '/', label: 'Home' },
    { to: '/help', label: 'Help' },
    { to: '/faq', label: 'FAQ' },
  ];
  const links = isLoggedIn ? authedLinks : guestLinks;

  return (
    <div className="min-h-screen bg-app flex flex-col">
      {/* Floating navbar */}
      <header className="sticky top-0 z-50 px-4 md:px-6 pt-4">
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-all duration-300 glass-card ${
            scrolled ? 'shadow-card' : ''
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-grad-primary flex items-center justify-center shadow-glow">
              <Scale className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="font-display text-lg font-bold text-ink tracking-tight">LegalEase AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.to ? 'text-ink bg-white/[0.06]' : 'text-ink-dim hover:text-ink hover:bg-white/[0.04]'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="btn-ghost">Profile</Link>
                <button onClick={handleLogout} className="btn-secondary !py-2 !px-4 text-xs">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Log in</Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 text-xs">Get Started</Link>
              </>
            )}
          </div>

          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-ink"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden max-w-7xl mx-auto mt-2 rounded-2xl bg-base-2/95 backdrop-blur-xl border border-border p-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="px-3 py-2.5 rounded-lg text-sm font-medium text-ink-dim hover:text-ink hover:bg-white/[0.05]">
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-risk-high">Log out</button>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2.5 rounded-lg text-sm font-medium text-ink-dim hover:text-ink">Log in</Link>
                <Link to="/register" className="btn-primary justify-center mt-1">Get Started</Link>
              </>
            )}
          </div>
        )}
      </header>

      <div className="flex-1">
        <main>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.25, ease: "easeInOut" }}><Home /></motion.div>} />
              <Route path="/login" element={<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.25, ease: "easeInOut" }}><Login /></motion.div>} />
              <Route path="/register" element={<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.25, ease: "easeInOut" }}><Register /></motion.div>} />
              <Route path="/dashboard" element={<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.25, ease: "easeInOut" }}><Dashboard /></motion.div>} />
              <Route path="/assistant" element={<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.25, ease: "easeInOut" }}><DashboardLayout><Assistant /></DashboardLayout></motion.div>} />
              <Route path="/documents" element={<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.25, ease: "easeInOut" }}><Documents /></motion.div>} />
              <Route path="/schemes" element={<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.25, ease: "easeInOut" }}><Schemes /></motion.div>} />
              <Route path="/profile" element={<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.25, ease: "easeInOut" }}><Profile /></motion.div>} />
              <Route path="/help" element={<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.25, ease: "easeInOut" }}><Help /></motion.div>} />
              <Route path="/faq" element={<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.25, ease: "easeInOut" }}><Faq /></motion.div>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
