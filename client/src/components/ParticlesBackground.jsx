import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

export const ParticlesBackground = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: { color: { value: 'transparent' } },
        particles: {
          number: { value: 50 },
          size: { value: 3 },
          move: { enable: true, speed: 1 },
          opacity: { value: 0.3 },
        },
        interactivity: {
          events: { onHover: { enable: true, mode: 'repulse' } },
        },
      }}
      className="absolute inset-0 -z-10"
    />
  );
};