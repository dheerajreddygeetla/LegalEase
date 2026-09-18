import { useRef } from 'react';

// Subtle, mouse-tracked 3D tilt. Capped to a few degrees so it reads as
// premium depth rather than a gimmick, and settles smoothly on leave.
const TiltCard = ({ children, className = '', max = 6, glare = true, ...props }) => {
  const ref = useRef(null);

  // Filter out framer-motion specific props to avoid passing them to DOM elements
  const { whileHover, whileTap, animate, initial, exit, transition, ...domProps } = props;

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    // Tilt rotation removed per user instruction
    el.style.transform = 'translateY(-4px)';
    if (glare) {
      el.style.setProperty('--glare-x', `${px * 100}%`);
      el.style.setProperty('--glare-y', `${py * 100}%`);
    }
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translateY(0)';
  };

  return (
    <div className="tilt-wrap" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div ref={ref} className={`tilt-card relative ${className}`} {...domProps}>
        {children}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.25), transparent 55%)',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TiltCard;
