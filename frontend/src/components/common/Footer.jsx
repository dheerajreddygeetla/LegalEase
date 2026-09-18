import { Link } from 'react-router-dom';
import { Scale, Mail, Heart } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { motion } from 'framer-motion';
import { useState } from 'react';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/* ── Social Icon Button ────────────────────────────────────── */
const SocialBtn = ({ icon: Icon, href, label, hoverColor }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.12, y: -3 }}
      whileTap={{ scale: 0.92 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="w-10 h-10 rounded-xl flex items-center justify-center"
      style={{
        background: hovered ? `${hoverColor}15` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? hoverColor + '40' : 'rgba(255,255,255,0.08)'}`,
        color: hovered ? hoverColor : 'var(--text-muted)',
        boxShadow: hovered ? `0 0 20px ${hoverColor}30` : 'none',
        transition: 'background 0.25s ease, border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      <Icon className="w-4 h-4" style={{ filter: hovered ? `drop-shadow(0 0 4px ${hoverColor}80)` : 'none' }} />
    </motion.a>
  );
};

/* ── Animated link ─────────────────────────────────────────── */
const FooterLink = ({ to, label }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <Link
        to={to}
        className="text-sm inline-flex items-center gap-1.5 transition-all duration-200"
        style={{
          color: hovered ? 'var(--text-primary)' : 'var(--text-muted)',
          transform: hovered ? 'translateX(6px)' : 'translateX(0)',
          transition: 'color 0.2s ease, transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span
          style={{
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: hovered ? 'var(--accent-gold)' : 'var(--text-muted)',
            flexShrink: 0,
            display: 'inline-block',
            transition: 'background 0.2s ease',
          }}
        />
        {label}
      </Link>
    </li>
  );
};

/* ── Footer ───────────────────────────────────────────────── */
const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [logoHovered, setLogoHovered] = useState(false);

  const socialLinks = [
    { icon: GithubIcon, href: '#', label: 'GitHub', hoverColor: '#F0F6FC' },
    { icon: TwitterIcon, href: '#', label: 'Twitter', hoverColor: '#1DA1F2' },
    { icon: LinkedinIcon, href: '#', label: 'LinkedIn', hoverColor: '#0A66C2' },
    { icon: Mail, href: 'mailto:contact@legalease.in', label: 'Email', hoverColor: '#D4A43A' },
  ];

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(8,11,20,0.65) 0%, rgba(5,7,12,0.92) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(212,164,58,0.2)',
      }}
    >
      {/* Animated gold shimmer top line */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(212,164,58,0.7) 30%, rgba(232,192,92,1) 50%, rgba(212,164,58,0.7) 70%, transparent 100%)',
            animation: 'shimmer-sweep 5s linear infinite',
          }}
        />
      </div>

      {/* Ambient orb */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 700,
          height: 350,
          background: 'radial-gradient(ellipse at 50% 100%, rgba(184,135,30,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Corner decorative elements */}
      <div
        className="absolute top-16 left-0 pointer-events-none"
        style={{
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(107,143,212,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-5 md:col-span-1">
            {/* 3D flip logo */}
            <Link
              to="/"
              className="inline-flex items-center gap-3 group"
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
            >
              <div style={{ perspective: 600 }}>
                <motion.div
                  animate={{ rotateY: logoHovered ? 360 : 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #C9A84C 0%, #DEB84C 40%, #926A14 100%)',
                    boxShadow: logoHovered
                      ? '0 0 24px rgba(212,164,58,0.5), 0 4px 20px rgba(184,135,30,0.3)'
                      : '0 4px 16px rgba(184,135,30,0.25)',
                    transition: 'box-shadow 0.3s ease',
                  }}
                >
                  <Scale className="w-4.5 h-4.5 text-white" />
                </motion.div>
              </div>
              <span
                className="text-xl font-bold tracking-tight font-sans"
                style={{ color: logoHovered ? '#D4A43A' : 'var(--text-primary)', transition: 'color 0.25s ease' }}
              >
                Legal<span className="gold-shimmer-static">Ease</span>
              </span>
            </Link>

            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}
            >
              Understand Your Rights.<br />
              Discover Your Benefits.<br />
              Take the Next Step.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5 pt-1">
              {socialLinks.map((sl) => (
                <SocialBtn key={sl.label} {...sl} />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-[11px] uppercase tracking-[0.18em] font-bold mb-5 flex items-center gap-2"
              style={{ color: 'var(--accent-gold)' }}
            >
              <span
                style={{
                  width: 16,
                  height: 1.5,
                  background: 'var(--accent-gold)',
                  display: 'inline-block',
                  borderRadius: 1,
                }}
              />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: t('home') },
                { to: '/help', label: t('help') || 'Help' },
                { to: '/schemes', label: t('schemes') },
                { to: '/dashboard', label: t('dashboard') },
              ].map(({ to, label }) => (
                <FooterLink key={to} to={to} label={label} />
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="text-[11px] uppercase tracking-[0.18em] font-bold mb-5 flex items-center gap-2"
              style={{ color: 'var(--accent-gold)' }}
            >
              <span
                style={{
                  width: 16,
                  height: 1.5,
                  background: 'var(--accent-gold)',
                  display: 'inline-block',
                  borderRadius: 1,
                }}
              />
              Legal
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Service' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/disclaimer', label: 'Disclaimer' },
              ].map(({ to, label }) => (
                <FooterLink key={to} to={to} label={label} />
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3
              className="text-[11px] uppercase tracking-[0.18em] font-bold mb-5 flex items-center gap-2"
              style={{ color: 'var(--accent-gold)' }}
            >
              <span
                style={{
                  width: 16,
                  height: 1.5,
                  background: 'var(--accent-gold)',
                  display: 'inline-block',
                  borderRadius: 1,
                }}
              />
              Features
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/assistant', label: 'AI Legal Assistant' },
                { to: '/documents', label: 'Document Analysis' },
                { to: '/schemes', label: 'Scheme Discovery' },
                { to: '/eligibility', label: 'Eligibility Check' },
              ].map(({ to, label }) => (
                <FooterLink key={to} to={to} label={label} />
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(42, 48, 74, 0.5)' }}
        >
          <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            © {currentYear} LegalEase. All rights reserved.
            <span className="hidden sm:inline">· Built for Indian citizens</span>
            <span className="flex items-center gap-1 ml-1">
              with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" style={{ filter: 'drop-shadow(0 0 3px rgba(244,63,94,0.7))' }} /> in India 🇮🇳
            </span>
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: '#52B788',
                  boxShadow: '0 0 6px #52B788',
                  display: 'inline-block',
                  animation: 'pulse-ring 2s ease-in-out infinite',
                }}
              />
              All systems operational
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Powered by AI · Not legal advice
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
