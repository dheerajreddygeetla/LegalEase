import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Scale, FileText, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useEffect, useRef, useState, useCallback } from 'react';
import Button from '../common/Button';

/* ── Floating particles ────────────────────────────────────── */
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1.5,
  duration: Math.random() * 14 + 10,
  delay: Math.random() * 8,
  drift: (Math.random() - 0.5) * 60,
  opacity: Math.random() * 0.5 + 0.2,
}));

/* ── Hero Showcase Glass Card ──────────────────────────────── */
const HeroCard3D = () => {
  const [hover, setHover] = useState(false);

  return (
    <div style={{ perspective: '1200px' }}>
      <motion.div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        animate={{
          y: hover ? -8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative rounded-2xl"
      >
        {/* Multi-layer glow backdrop */}
        <div
          className="absolute -inset-3 rounded-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 40% 30%, rgba(184,135,30,0.3) 0%, rgba(107,143,212,0.15) 50%, transparent 80%)',
            filter: 'blur(28px)',
            opacity: hover ? 0.9 : 0.5,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Secondary glow layer */}
        <div
          className="absolute -inset-1 rounded-3xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(212,164,58,0.2), transparent 50%, rgba(107,143,212,0.1))',
            filter: 'blur(12px)',
          }}
        />

        {/* Main Mockup Glass Card */}
        <div
          className="relative rounded-2xl p-6 md:p-7"
          style={{
            background: 'rgba(12, 15, 24, 0.92)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(28px)',
            boxShadow: '0 32px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Gold shimmer top border */}
          <div
            className="absolute top-0 left-8 right-8 h-px pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(212,164,58,0.7), rgba(232,192,92,0.9), rgba(212,164,58,0.7), transparent)',
            }}
          />

          {/* Header pill with status */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-700/40">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C 0%, #926A14 100%)',
                  boxShadow: '0 4px 16px rgba(184,135,30,0.4)',
                }}
              >
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100 tracking-wide">LegalEase AI</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" style={{ animation: 'pulse-ring 2s ease-in-out infinite' }} />
                  Active & Verified
                </div>
              </div>
            </div>
            <span
              className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
              style={{
                background: 'rgba(212,164,58,0.1)',
                border: '1px solid rgba(212,164,58,0.25)',
                color: 'rgba(212,164,58,0.9)',
              }}
            >
              v2.4 Pro
            </span>
          </div>

          {/* Chat flow preview */}
          <div className="space-y-3.5 text-xs">
            {/* User query bubble */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-slate-100"
              style={{
                background: 'linear-gradient(135deg, #1E2438 0%, #171C2E 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
              }}
            >
              "Am I eligible for PM Kisan Samman Nidhi if my family owns 2 hectares?"
            </motion.div>

            {/* AI response bubble */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="max-w-[92%] rounded-2xl rounded-tl-sm px-4 py-3 text-slate-200 leading-relaxed"
              style={{
                background: 'rgba(212, 164, 58, 0.06)',
                border: '1px solid rgba(212, 164, 58, 0.15)',
                boxShadow: 'inset 0 1px 0 rgba(212,164,58,0.08)',
              }}
            >
              <p className="font-semibold text-amber-300/90 mb-1.5 text-[11px] uppercase tracking-wider">✓ Eligible under Revised Guidelines</p>
              <p className="text-slate-300 text-[11.5px] leading-relaxed">
                The 2-hectare ceiling was removed in 2019. All landholding farmers now qualify subject to standard institutional exclusions.
              </p>
            </motion.div>
          </div>

          {/* Match Card Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="mt-5 rounded-xl p-3.5 flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, rgba(184,135,30,0.12) 0%, rgba(184,135,30,0.04) 100%)',
              border: '1px solid rgba(184,135,30,0.28)',
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <div className="text-xs font-bold text-slate-100">PM Kisan Samman Nidhi</div>
              <div className="text-[11px] text-amber-200/60 mt-0.5">Direct benefit: ₹6,000 / year · Ministry of Agriculture</div>
            </div>
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ml-3"
              style={{
                background: 'rgba(82,183,136,0.12)',
                border: '1px solid rgba(82,183,136,0.3)',
                color: '#52B788',
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>96% Match</span>
            </div>
          </motion.div>

        {/* Floating 3D Badge 1 - Top Right */}
        <motion.div
          animate={{ y: [0, -8, 0], rotateZ: [0, 1.5, 0] }}
          transition={{ duration: 4.5, ease: 'easeInOut', repeat: Infinity }}
          className="absolute -top-5 -right-5 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl"
          style={{
            background: 'rgba(12, 16, 30, 0.88)',
            border: '1px solid rgba(212, 164, 58, 0.35)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 16px 36px rgba(0,0,0,0.6), 0 0 20px rgba(212,164,58,0.25)',
            transform: 'translateZ(42px)',
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: '#D4A43A' }} />
          <span className="text-[11px] font-bold text-slate-100">100% Source-Grounded</span>
        </motion.div>

        {/* Floating 3D Badge 2 - Bottom Left */}
        <motion.div
          animate={{ y: [0, 8, 0], rotateZ: [0, -1.5, 0] }}
          transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity, delay: 1 }}
          className="absolute -bottom-6 -left-6 z-20 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
          style={{
            background: 'rgba(12, 16, 30, 0.88)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 16px 36px rgba(0,0,0,0.6), 0 0 20px rgba(59,130,246,0.25)',
            transform: 'translateZ(48px)',
          }}
        >
          <Shield className="w-4 h-4" style={{ color: '#60A5FA' }} />
          <div>
            <div className="text-[11px] font-bold text-slate-100">Constitution & Statutes</div>
            <div className="text-[9px] text-slate-400">Indian Legal Framework</div>
          </div>
        </motion.div>

        {/* Stacked depth cards behind the main card */}
        <div
          className="absolute -bottom-2 -left-2 -right-2 h-full rounded-2xl pointer-events-none"
          style={{
            background: 'rgba(8, 10, 18, 0.6)',
            border: '1px solid rgba(255,255,255,0.04)',
            zIndex: -1,
            transform: 'translateZ(-12px) translateY(6px) scale(0.97)',
          }}
        />
        <div
          className="absolute -bottom-4 -left-4 -right-4 h-full rounded-2xl pointer-events-none"
          style={{
            background: 'rgba(6, 8, 14, 0.4)',
            border: '1px solid rgba(255,255,255,0.02)',
            zIndex: -2,
            transform: 'translateZ(-24px) translateY(12px) scale(0.94)',
          }}
        />
      </div>
    </motion.div>
  </div>
);
};

/* ── Main HeroSection ───────────────────────────────────────── */
const HeroSection = () => {
  const { t } = useLanguage();

  const headingWords = ['Navigate', 'the', 'Law', 'with'];
  const accentWords = ['Unmatched', 'Clarity.'];

  return (
    <section
      className="relative overflow-hidden text-white bg-transparent"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
    >


      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              bottom: `${p.y % 30}%`,
              width: p.size,
              height: p.size,
              background: p.id % 3 === 0
                ? `rgba(212,164,58,${p.opacity})`
                : p.id % 3 === 1
                ? `rgba(107,143,212,${p.opacity * 0.7})`
                : `rgba(255,255,255,${p.opacity * 0.4})`,
              '--duration': `${p.duration}s`,
              '--delay': `${p.delay}s`,
              '--drift': `${p.drift}px`,
              animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              boxShadow: p.id % 3 === 0 ? `0 0 ${p.size * 3}px rgba(212,164,58,0.6)` : 'none',
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-7">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{
                  background: 'rgba(184,135,30,0.1)',
                  border: '1px solid rgba(184,135,30,0.35)',
                  color: '#D4A43A',
                  boxShadow: '0 0 24px rgba(184,135,30,0.18), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ filter: 'drop-shadow(0 0 4px rgba(212,164,58,0.8))' }} />
                <span>AI-Powered Legal Intelligence for India</span>
              </div>
            </motion.div>

            {/* Hero Heading — word-by-word reveal */}
            <div className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold tracking-tight leading-[1.1] text-white">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {headingWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 32, skewY: 4 }}
                    animate={{ opacity: 1, y: 0, skewY: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'inline-block' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                {accentWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 32, skewY: 4 }}
                    animate={{ opacity: 1, y: 0, skewY: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="gold-shimmer"
                    style={{ display: 'inline-block' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-base sm:text-lg leading-relaxed max-w-xl"
              style={{ color: 'rgba(148,163,184,0.9)' }}
            >
              LegalEase demystifies legal jargon, pinpoints citizen entitlements, and cross-references government schemes — grounded in verified statutory sources.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              <Link to="/register">
                <div className="relative">
                  {/* Pulsating glow ring */}
                  <span
                    style={{
                      position: 'absolute',
                      inset: -6,
                      borderRadius: 16,
                      border: '1px solid rgba(212,164,58,0.4)',
                      animation: 'glow-pulse-ring 2.5s ease-out infinite',
                      pointerEvents: 'none',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      inset: -14,
                      borderRadius: 20,
                      border: '1px solid rgba(212,164,58,0.2)',
                      animation: 'glow-pulse-ring 2.5s ease-out 0.5s infinite',
                      pointerEvents: 'none',
                    }}
                  />
                  <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
                    {t('startNow') || 'Get Started Free'}
                  </Button>
                </div>
              </Link>
              <Link to="/schemes">
                <Button variant="secondary" size="lg">
                  {t('exploreSchemes') || 'Explore 50+ Schemes'}
                </Button>
              </Link>
            </motion.div>

            {/* Trust highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="pt-6 border-t flex flex-wrap items-center gap-6 text-xs"
              style={{ borderColor: 'rgba(42,48,74,0.7)' }}
            >
              {[
                { icon: Shield, label: 'Verified Legal Citations', color: '#52B788' },
                { icon: Scale, label: 'Indian Constitution & Statutes', color: '#D4A43A' },
                { icon: FileText, label: 'Multilingual Voice & Chat', color: '#6B8FD4' },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-2"
                  style={{ color: 'rgba(148,163,184,0.75)' }}
                >
                  <Icon
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color, filter: `drop-shadow(0 0 5px ${color}80)` }}
                  />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: 3D Interactive Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <HeroCard3D />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer hidden lg:flex"
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
        >
          <span className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(100,116,139,0.7)' }}>Scroll</span>
          <ChevronDown
            className="w-4 h-4"
            style={{ color: 'rgba(212,164,58,0.6)', animation: 'bounce-gentle 2s ease-in-out infinite' }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
