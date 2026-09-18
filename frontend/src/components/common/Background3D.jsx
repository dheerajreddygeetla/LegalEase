import { useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

/**
 * Background3D
 * Full-screen, edge-to-edge 3D cybernetic atmosphere for the entire home page:
 * 1. Full-bleed top-to-bottom 3D cyber perspective grid
 * 2. Infinite perspective ground grid extending past bottom edge
 * 3. Infinite perspective ceiling grid extending way past the top edge (0px)
 * 4. Full-screen background matrix grid for 100% seamless full-page coverage
 * 5. Glowing Horizon Singularity Vanishing Line & Singularity Core at 50%
 * 6. Volumetric Radiant Gold, Sapphire & Emerald Nebulae spanning the entire viewport
 * 7. Multi-angle 3D Light Beams & Starlight particles across full height
 * 8. Oversized parallax container with negative bleed to eliminate any edge clipping
 */
const Background3D = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 60 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5) * 2;
      const ny = (e.clientY / innerHeight - 0.5) * 2;
      mouseX.set(nx * 26);
      mouseY.set(ny * 26);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #0F1629 0%, #080B14 55%, #05070C 100%)',
      }}
    >
      {/* ── 1. Parallax 3D World Container (negative bleed to prevent edge gap during parallax) ── */}
      <motion.div
        className="absolute"
        style={{
          top: '-80px',
          bottom: '-80px',
          left: '-80px',
          right: '-80px',
          x: smoothX,
          y: smoothY,
          perspective: '750px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ── 2. Full-bleed Matrix Space Grid (guarantees 100% full-screen coverage top to bottom) ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 164, 58, 0.16) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.14) 1px, transparent 1px)
            `,
            backgroundSize: '56px 56px',
            opacity: 0.9,
          }}
        />

        {/* ── 3. 3D Perspective Moving Cyber Ground Grid (starts at horizon and extends past bottom) ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '260%',
            height: '160%',
            left: '-80%',
            top: '50%',
            transform: 'rotateX(62deg)',
            transformOrigin: '50% 0%',
            backgroundImage: `
              linear-gradient(rgba(212, 164, 58, 0.50) 1.5px, transparent 1.5px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.45) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '70px 70px',
            animation: 'grid-slide 9s linear infinite',
            maskImage: 'linear-gradient(to bottom, black 15%, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 15%, black 80%, transparent 100%)',
          }}
        />

        {/* ── 4. 3D Perspective Converging Ceiling Grid (mirror of ground grid) ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '260%',
            height: '160%',
            left: '-80%',
            top: '-110%',
            transform: 'rotateX(-62deg)',
            transformOrigin: '50% 100%',
            backgroundImage: `
              linear-gradient(rgba(212, 164, 58, 0.50) 1.5px, transparent 1.5px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.45) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '70px 70px',
            animation: 'grid-slide-reverse 9s linear infinite',
            maskImage: 'linear-gradient(to top, black 15%, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 15%, black 80%, transparent 100%)',
          }}
        />

        {/* ── 5. Glowing Horizon Vanishing Line ── */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: '50%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 2%, rgba(212,164,58,0.9) 20%, rgba(255,255,255,1) 50%, rgba(212,164,58,0.9) 80%, transparent 98%)',
            boxShadow: '0 0 35px rgba(212,164,58,0.9), 0 0 70px rgba(99,102,241,0.6)',
            opacity: 0.95,
          }}
        />

        {/* Horizon Singularity Glow */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '320px',
            background: 'radial-gradient(ellipse at center, rgba(212,164,58,0.38) 0%, rgba(99,102,241,0.25) 40%, transparent 75%)',
            filter: 'blur(55px)',
          }}
        />

        {/* ── 6. Deep Volumetric Color Nebulae across Full Height (Mirrored Layout) ── */}
        {/* Top-Left Gold Nebula (mirrors Bottom-Right) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 650,
            height: 650,
            top: '-5%',
            left: '15%',
            background: 'radial-gradient(circle, rgba(212,164,58,0.18) 0%, rgba(245,158,11,0.06) 50%, transparent 70%)',
            filter: 'blur(90px)',
            animation: 'float-orb-1 26s ease-in-out infinite reverse',
          }}
        />
        {/* Top-Right Emerald Nebula (mirrors Bottom-Left) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 700,
            height: 700,
            top: '-10%',
            right: '5%',
            background: 'radial-gradient(circle, rgba(52,211,153,0.18) 0%, rgba(16,185,129,0.06) 50%, transparent 70%)',
            filter: 'blur(95px)',
            animation: 'float-orb-3 22s ease-in-out infinite',
          }}
        />
        {/* Center Sapphire Nebula (stays in center) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 750,
            height: 750,
            top: '15%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.20) 0%, rgba(30,58,138,0.08) 50%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'float-orb-2 24s ease-in-out infinite',
          }}
        />
        {/* Bottom-Left Gold Nebula (mirrors Top-Right) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 800,
            height: 600,
            bottom: '-15%',
            left: '20%',
            background: 'radial-gradient(circle, rgba(212,164,58,0.22) 0%, rgba(184,135,30,0.06) 55%, transparent 75%)',
            filter: 'blur(85px)',
            animation: 'float-orb-1 20s ease-in-out infinite',
          }}
        />
        {/* Bottom-Right Amber Nebula (mirrors Top-Left) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 650,
            height: 650,
            bottom: '-5%',
            right: '15%',
            background: 'radial-gradient(circle, rgba(212,164,58,0.18) 0%, rgba(245,158,11,0.06) 50%, transparent 70%)',
            filter: 'blur(90px)',
            animation: 'float-orb-1 26s ease-in-out infinite reverse',
          }}
        />

        {/* ── 7. 3D Floating Light Beams / Streamers (Mirrored Layout) ── */}
        {/* Bottom beams (original) */}
        {[
          { left: '15%', delay: '0s', duration: '6s', color: 'rgba(212,164,58,0.7)' },
          { left: '35%', delay: '2s', duration: '8s', color: 'rgba(99,102,241,0.7)' },
          { left: '60%', delay: '3.5s', duration: '7s', color: 'rgba(52,211,153,0.7)' },
          { left: '85%', delay: '1.5s', duration: '8.5s', color: 'rgba(212,164,58,0.65)' },
        ].map((beam, i) => (
          <div
            key={`bottom-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: beam.left,
              top: '-30%',
              width: '1px',
              height: '160%',
              background: `linear-gradient(180deg, transparent 0%, ${beam.color} 50%, transparent 100%)`,
              boxShadow: `0 0 12px ${beam.color}`,
              opacity: 0.45,
              transform: 'rotate(25deg)',
              animation: `pulse-beam ${beam.duration} ease-in-out infinite ${beam.delay}`,
            }}
          />
        ))}
        {/* Top beams (mirrored - opposite rotation) */}
        {[
          { left: '15%', delay: '0s', duration: '6s', color: 'rgba(212,164,58,0.7)' },
          { left: '35%', delay: '2s', duration: '8s', color: 'rgba(99,102,241,0.7)' },
          { left: '60%', delay: '3.5s', duration: '7s', color: 'rgba(52,211,153,0.7)' },
          { left: '85%', delay: '1.5s', duration: '8.5s', color: 'rgba(212,164,58,0.65)' },
        ].map((beam, i) => (
          <div
            key={`top-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: beam.left,
              top: '-80%',
              width: '1px',
              height: '160%',
              background: `linear-gradient(180deg, transparent 0%, ${beam.color} 50%, transparent 100%)`,
              boxShadow: `0 0 12px ${beam.color}`,
              opacity: 0.45,
              transform: 'rotate(-25deg)',
              animation: `pulse-beam-reverse ${beam.duration} ease-in-out infinite ${beam.delay}`,
            }}
          />
        ))}

        {/* ── 8. Floating 3D Micro Starlight Particles (Mirrored Layout) ── */}
        {/* Top half particles (mirroring bottom half around 50% horizon) */}
        {[
          { top: '22%', left: '30%', size: 4, delay: '1.9s' },
          { top: '10%', left: '82%', size: 5, delay: '2.2s' },
          { top: '6%', left: '18%', size: 4, delay: '0.7s' },
          { top: '34%', left: '64%', size: 5, delay: '1.7s' },
          { top: '30%', left: '40%', size: 4, delay: '3.1s' },
        ].map((p, idx) => (
          <div
            key={`top-${idx}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              background: '#FFFFFF',
              boxShadow: '0 0 12px #D4A43A, 0 0 24px #E8C05C',
              animation: `pulse-star 2.5s ease-in-out infinite alternate ${p.delay}`,
            }}
          />
        ))}
        {/* Bottom half particles (mirroring top half positions) */}
        {[
          { top: '78%', left: '30%', size: 4, delay: '1.9s' },
          { top: '90%', left: '82%', size: 5, delay: '2.2s' },
          { top: '94%', left: '18%', size: 4, delay: '0.7s' },
          { top: '66%', left: '64%', size: 5, delay: '1.7s' },
          { top: '70%', left: '40%', size: 4, delay: '3.1s' },
        ].map((p, idx) => (
          <div
            key={`bottom-${idx}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              background: '#FFFFFF',
              boxShadow: '0 0 12px #D4A43A, 0 0 24px #E8C05C',
              animation: `pulse-star 2.5s ease-in-out infinite alternate ${p.delay}`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Background3D;
