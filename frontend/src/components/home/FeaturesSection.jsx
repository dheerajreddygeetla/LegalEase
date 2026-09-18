import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Shield, FileText, Search, Mic, Globe, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useRef, useState, useCallback } from 'react';

/* ── Feature Card with clean hover lift and specular glare ──── */
const FeatureCard = ({ feature, index }) => {
  const cardRef = useRef(null);
  const [specular, setSpecular] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const Icon = feature.icon;

  const handleMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    setSpecular({ x: pctX, y: pctY });
  }, []);

  const handleLeave = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        className="h-full flex flex-col justify-between group"
        style={{
          position: 'relative',
          borderRadius: 24,
          padding: '30px',
          background: hovered
            ? 'rgba(14, 19, 36, 0.88)'
            : 'rgba(10, 14, 26, 0.72)',
          border: `1px solid ${hovered ? `${feature.color}60` : 'rgba(255,255,255,0.12)'}`,
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          boxShadow: hovered
            ? `0 32px 70px rgba(0,0,0,0.55), 0 0 30px ${feature.color}25, inset 0 1px 1px rgba(255,255,255,0.2)`
            : '0 16px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
          overflow: 'hidden',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
          cursor: 'default',
        }}
      >
        {/* Specular cursor highlight */}
        {hovered && (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: 'inherit',
              background: `radial-gradient(circle 180px at ${specular.x}% ${specular.y}%, rgba(255,255,255,0.055) 0%, transparent 70%)`,
              zIndex: 0,
            }}
          />
        )}

        {/* Gold shimmer top inset line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${feature.color}80, transparent)`,
            opacity: hovered ? 1 : 0.3,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Rotating conic border on hover */}
        {hovered && (
          <div
            style={{
              position: 'absolute',
              inset: -1,
              borderRadius: 'inherit',
              background: `conic-gradient(from 0deg, transparent 0%, ${feature.color}60 20%, transparent 40%, transparent 100%)`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              pointerEvents: 'none',
              padding: '1px',
              animation: 'border-rotate-spin 3s linear infinite',
            }}
          />
        )}

        <div className="space-y-5 relative z-10">
          {/* Header with icon and badge */}
          <div className="flex items-start justify-between">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-400"
              style={{
                background: hovered
                  ? `linear-gradient(135deg, ${feature.color}25 0%, ${feature.color}10 100%)`
                  : `${feature.color}14`,
                border: `1px solid ${feature.color}${hovered ? '50' : '28'}`,
                boxShadow: hovered ? `0 0 20px ${feature.color}25, inset 0 1px 0 rgba(255,255,255,0.06)` : 'none',
                transform: hovered ? 'scale(1.1) translateZ(4px)' : 'scale(1)',
                transition: 'all 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            >
              <Icon
                className="w-6 h-6"
                style={{
                  color: feature.color,
                  filter: hovered ? `drop-shadow(0 0 6px ${feature.color}90)` : 'none',
                  transition: 'filter 0.3s ease',
                }}
              />
            </div>

            <span
              className="text-[10.5px] font-bold px-2.5 py-1 rounded-full tracking-wide"
              style={{
                background: `${feature.color}10`,
                border: `1px solid ${feature.color}25`,
                color: `${feature.color}`,
                transition: 'all 0.3s ease',
                transform: hovered ? 'translateY(-2px)' : 'none',
              }}
            >
              {feature.badge}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-base font-bold tracking-tight transition-colors duration-300 leading-snug"
            style={{ color: hovered ? '#F8FAFC' : 'rgba(248,250,252,0.85)' }}
          >
            {feature.title}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: hovered ? 'rgba(148,163,184,0.9)' : 'rgba(100,116,139,0.85)' }}
          >
            {feature.description}
          </p>
        </div>

        {/* Bottom indicator */}
        <div
          className="pt-5 mt-5 flex items-center text-xs font-semibold relative z-10"
          style={{
            borderTop: `1px solid ${hovered ? `${feature.color}20` : 'rgba(255,255,255,0.05)'}`,
            color: feature.color,
            opacity: hovered ? 1 : 0.55,
            transition: 'all 0.3s ease',
          }}
        >
          <span>Learn more</span>
          <ArrowUpRight
            className="w-3.5 h-3.5 ml-1.5"
            style={{
              transform: hovered ? 'translate(3px, -3px)' : 'translate(0, 0)',
              transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ── FeaturesSection ─────────────────────────────────────── */
const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t('aiAssistant') || 'Constitutional & Legal Assistant',
      description: 'Instant, contextual guidance on statutory rights, labor codes, consumer protections, and dispute remedies.',
      badge: 'Statutory AI',
      color: '#D4A43A',
    },
    {
      icon: FileText,
      title: t('documentAnalyzer') || 'Document Summarizer & Analyzer',
      description: 'Upload tenancy agreements, deeds, or official notices to receive plain-language summaries and risk breakdowns.',
      badge: 'OCR & NLP',
      color: '#6B8FD4',
    },
    {
      icon: Search,
      title: t('governmentSchemes') || 'Entitlement Discovery Engine',
      description: 'Scan central and state government welfare schemes tailored to your demographic, occupation, and family size.',
      badge: '50+ Schemes',
      color: '#52B788',
    },
    {
      icon: Mic,
      title: t('voiceInteraction') || 'Voice-Enabled Legal Queries',
      description: 'Ask complex questions naturally via voice queries in your native tongue with clear spoken and text feedback.',
      badge: 'Speech AI',
      color: '#E07A5F',
    },
    {
      icon: Globe,
      title: t('multilingualSupport') || 'Pan-Indian Multilingual Support',
      description: 'Democratizing justice by supporting English, Hindi, Telugu, Tamil, and other official scheduled languages.',
      badge: '8+ Languages',
      color: '#9B7DD4',
    },
    {
      icon: CheckCircle2,
      title: t('sourceGrounded') || 'Zero Hallucination Verification',
      description: 'Every statement is cited directly from gazette notifications, high court rulings, or official ministry portals.',
      badge: '100% Sourced',
      color: '#3BAFDA',
    },
  ];

  return (
    <section
      className="py-24 relative overflow-hidden bg-transparent"
    >
      {/* Background radial mesh */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 1000,
          height: 700,
          background: 'radial-gradient(ellipse at center, rgba(184,135,30,0.04) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Diagonal decorative lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[10, 30, 60, 85].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${pos}%`,
              width: '1px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(212,164,58,0.06) 50%, transparent 100%)',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16 space-y-4"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              background: 'rgba(184,135,30,0.08)',
              border: '1px solid rgba(184,135,30,0.25)',
              color: 'rgba(212,164,58,0.9)',
            }}
          >
            Capabilities
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans"
            style={{ color: 'var(--text-primary)' }}
          >
            Designed for{' '}
            <span className="gold-shimmer">Absolute Accuracy.</span>
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            Engineered to empower citizens with reliable, transparent, and legally-verified information.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
