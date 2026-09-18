import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

/* ── Animated Avatar Ring ─────────────────────────────────── */
const AvatarRing = ({ initials, color = '#D4A43A' }) => (
  <div className="relative flex-shrink-0" style={{ width: 44, height: 44 }}>
    {/* Spinning conic border */}
    <div
      style={{
        position: 'absolute',
        inset: -2,
        borderRadius: '50%',
        background: `conic-gradient(from 0deg, ${color}, ${color}30, ${color})`,
        animation: 'spin-ring 4s linear infinite',
        padding: 2,
      }}
    />
    {/* Inner avatar */}
    <div
      style={{
        position: 'absolute',
        inset: 2,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}25 0%, ${color}10 100%)`,
        border: `1px solid ${color}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.03em',
      }}
    >
      {initials}
    </div>
    {/* Online indicator */}
    <div
      style={{
        position: 'absolute',
        bottom: 1,
        right: 1,
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#52B788',
        border: '1.5px solid rgba(12,15,24,0.9)',
        boxShadow: '0 0 6px #52B78880',
        zIndex: 2,
      }}
    />
  </div>
);

/* ── Animated stars ───────────────────────────────────────── */
const AnimatedStars = ({ count = 5 }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, rotate: -30, opacity: 0 }}
        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <Star
          className="w-4 h-4"
          style={{
            fill: '#FBBF24',
            color: '#FBBF24',
            filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.6))',
          }}
        />
      </motion.div>
    ))}
  </div>
);

/* ── Testimonial Card ─────────────────────────────────────── */
const TestimonialCard = ({ t, isActive }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-full flex flex-col justify-between"
      style={{
        position: 'relative',
        borderRadius: 20,
        padding: '28px',
        background: hovered
          ? 'rgba(18, 22, 36, 0.94)'
          : 'rgba(14, 17, 28, 0.82)',
        border: `1px solid ${hovered ? 'rgba(212,164,58,0.25)' : 'rgba(255,255,255,0.08)'}`,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: hovered
          ? '0 24px 64px rgba(0,0,0,0.45), 0 0 20px rgba(212,164,58,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        overflow: 'hidden',
        minHeight: 240,
      }}
    >
      {/* Shimmer top line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,164,58,0.6), transparent)',
          opacity: hovered ? 1 : 0.3,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Large quote mark watermark */}
      <Quote
        className="absolute top-5 right-5 pointer-events-none"
        style={{
          width: 40,
          height: 40,
          color: hovered ? 'rgba(212,164,58,0.25)' : 'rgba(212,164,58,0.1)',
          transition: 'color 0.3s ease',
          transform: 'rotate(180deg)',
        }}
      />

      <div className="space-y-4 relative z-10">
        <AnimatedStars count={t.rating} />
        <p
          className="text-sm leading-relaxed"
          style={{
            color: hovered ? 'rgba(203,213,225,0.95)' : 'rgba(148,163,184,0.85)',
            fontStyle: 'italic',
            lineHeight: 1.7,
          }}
        >
          "{t.quote}"
        </p>
      </div>

      {/* Author */}
      <div
        className="pt-5 mt-5 flex items-center gap-3 relative z-10"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <AvatarRing initials={t.avatar} color="#D4A43A" />
        <div>
          <div
            className="text-sm font-bold"
            style={{ color: hovered ? '#F8FAFC' : 'rgba(248,250,252,0.85)' }}
          >
            {t.name}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(100,116,139,0.8)' }}>
            {t.role} · {t.location}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── TestimonialsSection ───────────────────────────────────── */
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Small Landholding Farmer',
      location: 'Madhya Pradesh',
      avatar: 'RK',
      quote:
        'LegalEase clarified the exclusions under PM Kisan in plain Hindi. I realized I was fully eligible after my village office was confused for months.',
      rating: 5,
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Law Student & Legal Aid Volunteer',
      location: 'Pune, Maharashtra',
      avatar: 'AD',
      quote:
        'The citation grounding is unparalleled. I use it to draft initial legal notices and check statutory references in consumer dispute cases.',
      rating: 5,
    },
    {
      name: 'Venkatesh Rao',
      role: 'Micro-Enterprise Owner',
      location: 'Hyderabad, Telangana',
      avatar: 'VR',
      quote:
        'Found two MSME interest subsidy schemes we had no idea existed. The document checklist saved us weeks of back-and-forth with the bank.',
      rating: 5,
    },
    {
      name: 'Priya Nair',
      role: 'School Teacher',
      location: 'Thiruvananthapuram, Kerala',
      avatar: 'PN',
      quote:
        'The multilingual support is incredible. I got answers in Malayalam with full legal citations. It felt like having a personal advocate.',
      rating: 5,
    },
  ];

  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section
      className="py-24 relative overflow-hidden bg-transparent"
    >
      {/* Background mesh */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 80%, rgba(184,135,30,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(107,143,212,0.04) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              background: 'rgba(184,135,30,0.08)',
              border: '1px solid rgba(184,135,30,0.25)',
              color: 'rgba(212,164,58,0.9)',
            }}
          >
            Testimonials
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans"
            style={{ color: 'var(--text-primary)' }}
          >
            Trusted Across{' '}
            <span className="gold-shimmer">Communities.</span>
          </h2>
          <p className="text-base sm:text-lg" style={{ color: 'var(--text-muted)' }}>
            Real experiences from citizens, students, and advocates using LegalEase.
          </p>
        </motion.div>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {testimonials.slice(0, 3).map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
            >
              <TestimonialCard t={t} isActive={false} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <TestimonialCard t={testimonials[current]} isActive={true} />
            </motion.div>
          </AnimatePresence>

          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)',
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === current ? '#D4A43A' : 'rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)',
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Trust badges row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12"
        >
          {[
            { label: '10,000+ Active Users', color: '#52B788' },
            { label: '4.9/5 Average Rating', color: '#FBBF24' },
            { label: '99.8% Accuracy Rate', color: '#D4A43A' },
          ].map(({ label, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: `${color}0A`,
                border: `1px solid ${color}25`,
                color: `${color}C0`,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: color,
                  boxShadow: `0 0 8px ${color}`,
                  display: 'inline-block',
                }}
              />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
