import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, ArrowLeft } from 'lucide-react';
import Background3D from '../common/Background3D';

/* Floating particles for auth bg */
const AUTH_PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 1,
  duration: Math.random() * 12 + 10,
  delay: Math.random() * 6,
  drift: (Math.random() - 0.5) * 40,
  opacity: Math.random() * 0.4 + 0.15,
}));

const AuthLayout = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-transparent dark"
      style={{
        colorScheme: 'dark',
        '--text-primary': '#FFFFFF',
        '--text-secondary': '#CBD5E1',
        '--text-muted': '#94A3B8',
        '--border-color': 'rgba(42, 48, 74, 0.8)',
      }}
    >
      {/* Immersive 3D perspective background */}
      <Background3D />
      {/* ── Aurora orbs ── */}
      <div
        className="orb orb-1 absolute"
        style={{
          width: 700,
          height: 700,
          top: '-25%',
          left: '-18%',
          background: 'radial-gradient(circle, rgba(184,135,30,0.2) 0%, rgba(212,164,58,0.06) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="orb orb-2 absolute"
        style={{
          width: 600,
          height: 600,
          bottom: '-18%',
          right: '-12%',
          background: 'radial-gradient(circle, rgba(90,106,136,0.22) 0%, rgba(107,143,212,0.08) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="orb orb-3 absolute"
        style={{
          width: 350,
          height: 350,
          top: '60%',
          left: '65%',
          background: 'radial-gradient(circle, rgba(82,183,136,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {AUTH_PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              bottom: `${p.y % 25}%`,
              width: p.size,
              height: p.size,
              background: p.id % 2 === 0
                ? `rgba(212,164,58,${p.opacity})`
                : `rgba(107,143,212,${p.opacity * 0.8})`,
              animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              '--duration': `${p.duration}s`,
              '--delay': `${p.delay}s`,
              '--drift': `${p.drift}px`,
              boxShadow: p.id % 2 === 0 ? `0 0 ${p.size * 3}px rgba(212,164,58,0.5)` : 'none',
            }}
          />
        ))}
      </div>

      {/* Back to home link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold group z-20 transition-all duration-300 px-4 py-2 rounded-lg"
        style={{
          color: 'rgba(212,164,58,0.9)',
          background: 'rgba(212,164,58,0.08)',
          border: '1px solid rgba(212,164,58,0.2)',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#E8C05C';
          e.currentTarget.style.background = 'rgba(212,164,58,0.15)';
          e.currentTarget.style.borderColor = 'rgba(212,164,58,0.4)';
          e.currentTarget.style.transform = 'translateX(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(212,164,58,0.9)';
          e.currentTarget.style.background = 'rgba(212,164,58,0.08)';
          e.currentTarget.style.borderColor = 'rgba(212,164,58,0.2)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <ArrowLeft
          className="w-3.5 h-3.5 group-hover:-translate-x-1"
          style={{
            transition: 'transform 0.3s ease',
          }}
        />
        Back to home
      </Link>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-3 mb-5 group">
            {/* Animated logo entrance */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-12 h-12"
            >
              {/* Glow ring */}
              <span
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'rgba(212,164,58,0.3)',
                  filter: 'blur(12px)',
                  transform: 'scale(1.4)',
                  opacity: 0.6,
                }}
              />
              {/* Pulsating ring */}
              <span
                style={{
                  position: 'absolute',
                  inset: -4,
                  borderRadius: 18,
                  border: '1px solid rgba(212,164,58,0.3)',
                  animation: 'glow-pulse-ring 3s ease-out infinite',
                  pointerEvents: 'none',
                }}
              />
              <div
                className="relative w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C 0%, #DEB84C 40%, #926A14 100%)',
                  boxShadow: '0 8px 32px rgba(184,135,30,0.5), 0 0 0 1px rgba(212,164,58,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <Scale
                  className="w-6 h-6 text-white"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
                />
              </div>
            </motion.div>

            <motion.span
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-3xl font-extrabold text-white tracking-tight font-sans"
            >
              Legal<span className="gold-shimmer-static">Ease</span>
            </motion.span>
          </Link>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-sm"
            style={{ color: 'rgba(100,116,139,0.75)' }}
          >
            Understand Your Rights. Discover Your Benefits.
          </motion.p>
        </div>

        {/* Multi-layer glass form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Outer glow backdrop */}
          <div
            style={{
              position: 'absolute',
              inset: -12,
              borderRadius: 32,
              background: 'radial-gradient(ellipse at 50% 20%, rgba(212,164,58,0.15) 0%, transparent 70%)',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }}
          />

          {/* Outer ring layer */}
          <div
            style={{
              position: 'absolute',
              inset: -1,
              borderRadius: 25,
              background: 'linear-gradient(135deg, rgba(212,164,58,0.15), transparent 40%, rgba(107,143,212,0.08) 80%, transparent)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Main form card */}
          <div
            className="rounded-2xl p-8 relative z-10"
            style={{
              background: 'rgba(12, 16, 26, 0.92)',
              border: '1px solid rgba(42, 48, 74, 0.8)',
              backdropFilter: 'blur(28px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(28px) saturate(1.3)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            {/* Top shimmer border */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(212,164,58,0.6), rgba(232,192,92,0.8), rgba(212,164,58,0.6), transparent)',
                pointerEvents: 'none',
              }}
            />
            {/* Bottom subtle line */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: '20%',
                right: '20%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(107,143,212,0.2), transparent)',
                pointerEvents: 'none',
              }}
            />

            {/* Noise grain */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                opacity: 0.02,
                pointerEvents: 'none',
              }}
            />

            <div className="relative z-10">
              <Outlet />
            </div>
          </div>
        </motion.div>

        {/* Bottom copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center mt-6 text-xs"
          style={{ color: 'rgba(42,48,74,0.9)' }}
        >
          © {new Date().getFullYear()} LegalEase. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
