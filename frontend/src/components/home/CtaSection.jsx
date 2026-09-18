import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Award, Users } from 'lucide-react';
import Button from '../common/Button';

const CtaSection = () => {
  const words = ['Ready', 'to', 'Unlock', 'Your', 'Legal', 'Rights', 'and', 'Benefits?'];

  const floatingIcons = [
    { icon: Shield, color: '#52B788', delay: 0, x: '-15%', y: '20%' },
    { icon: Award, color: '#D4A43A', delay: 0.5, x: '110%', y: '15%' },
    { icon: Users, color: '#6B8FD4', delay: 1, x: '105%', y: '65%' },
    { icon: Sparkles, color: '#E07A5F', delay: 1.5, x: '-18%', y: '60%' },
  ];

  return (
    <section
      className="relative overflow-hidden py-28 text-white bg-transparent"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central gold glow */}
        <div
          className="orb orb-1 absolute"
          style={{
            width: 800,
            height: 500,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse, rgba(184,135,30,0.18) 0%, rgba(184,135,30,0.06) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Left blue accent */}
        <div
          className="absolute"
          style={{
            width: 400,
            height: 400,
            top: 0,
            left: 0,
            background: 'radial-gradient(circle, rgba(107,143,212,0.1) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Right emerald accent */}
        <div
          className="absolute"
          style={{
            width: 400,
            height: 400,
            bottom: 0,
            right: 0,
            background: 'radial-gradient(circle, rgba(82,183,136,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Rotating geometric grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />

        {/* Radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5,7,12,0.7) 100%)',
          }}
        />
      </div>

      {/* Floating icons */}
      {floatingIcons.map(({ icon: Icon, color, delay, x, y }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute hidden lg:flex items-center justify-center"
          style={{
            left: x,
            top: y,
            width: 52,
            height: 52,
            borderRadius: 16,
            background: `${color}12`,
            border: `1px solid ${color}25`,
            backdropFilter: 'blur(12px)',
            animation: `bounce-gentle ${4 + i}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}
        >
          <Icon
            style={{
              width: 22,
              height: 22,
              color: color,
              filter: `drop-shadow(0 0 8px ${color}80)`,
            }}
          />
        </motion.div>
      ))}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-7"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{
                background: 'rgba(184,135,30,0.1)',
                border: '1px solid rgba(184,135,30,0.35)',
                color: '#D4A43A',
                boxShadow: '0 0 20px rgba(184,135,30,0.15)',
              }}
            >
              <Sparkles
                className="w-3.5 h-3.5"
                style={{ filter: 'drop-shadow(0 0 4px rgba(212,164,58,0.8))' }}
              />
              <span>Empower Your Citizens & Family Today</span>
            </div>
          </motion.div>

          {/* Word-by-word heading reveal */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white font-sans">
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 28, rotateX: 40 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ display: 'inline-block', transformOrigin: 'bottom' }}
                >
                  {['Your', 'Legal', 'Rights'].includes(word)
                    ? <span className="gold-shimmer">{word}</span>
                    : word}
                </motion.span>
              ))}
            </div>
          </h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: 'rgba(148,163,184,0.85)' }}
          >
            Create an account in less than two minutes. No legal jargon, no hidden consultation fees, just direct clarity.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap items-center justify-center gap-5 pt-2"
          >
            <Link to="/register">
              <div className="relative">
                {/* Outer pulsating rings */}
                <span
                  style={{
                    position: 'absolute',
                    inset: -8,
                    borderRadius: 18,
                    border: '1px solid rgba(212,164,58,0.35)',
                    animation: 'glow-pulse-ring 2.5s ease-out infinite',
                    pointerEvents: 'none',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    inset: -18,
                    borderRadius: 24,
                    border: '1px solid rgba(212,164,58,0.18)',
                    animation: 'glow-pulse-ring 2.5s ease-out 0.6s infinite',
                    pointerEvents: 'none',
                  }}
                />
                <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
                  Create Free Account
                </Button>
              </div>
            </Link>
            <Link to="/schemes">
              <Button variant="secondary" size="lg">
                Browse Schemes
              </Button>
            </Link>
          </motion.div>

          {/* Micro trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="pt-4 text-xs flex flex-wrap items-center justify-center gap-4"
            style={{ color: 'rgba(100,116,139,0.7)' }}
          >
            {['No credit card required', 'Free forever plan', 'Data never sold'].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'rgba(212,164,58,0.5)',
                    display: 'inline-block',
                  }}
                />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom decorative arc */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(212,164,58,0.4) 30%, rgba(232,192,92,0.6) 50%, rgba(212,164,58,0.4) 70%, transparent 100%)',
        }}
      />
    </section>
  );
};

export default CtaSection;
