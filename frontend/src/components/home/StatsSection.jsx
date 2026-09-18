import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

/* ── Animated counter hook ────────────────────────────────── */
const useCounter = (target, duration = 1800, startOnMount = false) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(startOnMount);

  const start = () => setStarted(true);

  useEffect(() => {
    if (!started) return;

    // Parse numeric target (strip symbols)
    const numeric = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    if (isNaN(numeric)) return;

    let startTime = null;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * numeric);
      if (progress < 1) requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return { count, start };
};

/* ── SVG ring progress ────────────────────────────────────── */
const RingProgress = ({ progress = 0.75, size = 80, color = '#D4A43A' }) => {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  return (
    <svg
      width={size}
      height={size}
      style={{ position: 'absolute', top: -size / 2, left: -size / 2, opacity: 0.7, pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id={`ringGrad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={`${color}20`} strokeWidth={2}
      />
      {/* Fill */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={`url(#ringGrad-${color.replace('#', '')})`}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
          transition: 'stroke-dashoffset 1.8s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      />
    </svg>
  );
};

/* ── Individual stat tile ─────────────────────────────────── */
const StatTile = ({ stat, index, colors }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { count, start } = useCounter(stat.numericValue, 1800);
  const [ringVisible, setRingVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (inView) {
      start();
      setTimeout(() => setRingVisible(true), 200);
    }
  }, [inView]);

  const color = colors[index % colors.length];

  // Format display value
  const formatCount = () => {
    const num = count;
    if (stat.value.includes('₹')) {
      if (num >= 100) return `₹${(num / 100).toFixed(1)}Cr`;
      return `₹${num.toFixed(1)}`;
    }
    if (stat.value.includes('%')) return `${num.toFixed(1)}%`;
    if (stat.value.includes('+')) return `${Math.round(num)}+`;
    return `${Math.round(num)}`;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative text-center group cursor-default"
      style={{
        padding: '28px 16px',
        borderRadius: 20,
        background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: `1px solid ${hovered ? `${color}30` : 'rgba(255,255,255,0.04)'}`,
        transition: 'all 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: hovered ? `0 0 40px ${color}15, 0 8px 32px rgba(0,0,0,0.1)` : 'none',
      }}
    >
      {/* Progress ring background element */}
      <div
        className="absolute top-1/2 left-1/2 pointer-events-none"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <RingProgress
          progress={ringVisible ? stat.ringProgress : 0}
          size={120}
          color={color}
        />
      </div>

      {/* Glow dot */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 12px ${color}, 0 0 24px ${color}80`,
          opacity: hovered ? 1 : 0.5,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Counter */}
      <motion.div
        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 font-sans"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: hovered ? `drop-shadow(0 0 8px ${color}80)` : 'none',
          transition: 'filter 0.3s ease',
        }}
      >
        {inView ? formatCount() : stat.value}
      </motion.div>

      {/* Label */}
      <div
        className="text-xs sm:text-sm font-semibold mb-1.5 transition-colors duration-300"
        style={{ color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)' }}
      >
        {stat.label}
      </div>

      {/* Sub-label */}
      <div
        className="text-[11px] font-medium px-3 py-1 rounded-full inline-block"
        style={{
          color: `${color}B0`,
          background: `${color}0F`,
          border: `1px solid ${color}20`,
        }}
      >
        {stat.sub}
      </div>
    </motion.div>
  );
};

/* ── StatsSection ─────────────────────────────────────────── */
const StatsSection = () => {
  const stats = [
    { value: '50+', numericValue: 50, label: 'Central & State Schemes', sub: 'Verified weekly', ringProgress: 0.7 },
    { value: '8+', numericValue: 8, label: 'Indian Regional Languages', sub: 'Native translations', ringProgress: 0.55 },
    { value: '99.8%', numericValue: 99.8, label: 'Statutory Grounding Accuracy', sub: 'Zero unverified claims', ringProgress: 0.95 },
    { value: '₹12.4Cr', numericValue: 1240, label: 'Citizen Entitlements Found', sub: 'Across 14 sectors', ringProgress: 0.8 },
  ];

  const colors = ['#D4A43A', '#6B8FD4', '#52B788', '#E07A5F'];

  return (
    <section
      className="py-16 relative overflow-hidden bg-transparent"
      style={{
        background: 'rgba(8, 11, 20, 0.35)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(212,164,58,0.2)',
        borderBottom: '1px solid rgba(212,164,58,0.2)',
      }}
    >
      {/* Animated gold ribbon top */}
      <div
        className="absolute top-0 left-0 right-0 h-px overflow-hidden"
        style={{ background: 'transparent' }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(212,164,58,0.6) 30%, rgba(232,192,92,0.9) 50%, rgba(212,164,58,0.6) 70%, transparent 100%)',
            animation: 'shimmer-sweep 4s linear infinite',
            width: '100%',
          }}
        />
      </div>

      {/* Background ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(184,135,30,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(184,135,30,0.08)',
              border: '1px solid rgba(184,135,30,0.2)',
              color: 'rgba(212,164,58,0.8)',
            }}
          >
            By the Numbers
          </span>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2">
          {stats.map((stat, index) => (
            <StatTile key={index} stat={stat} index={index} colors={colors} />
          ))}
        </div>
      </div>

      {/* Bottom ribbon */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(212,164,58,0.3) 50%, transparent 100%)',
        }}
      />
    </section>
  );
};

export default StatsSection;
