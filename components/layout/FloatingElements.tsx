'use client';

const ORBS = [
  {
    size: 400,
    top: '5%',
    left: '10%',
    color: 'rgba(168, 85, 247, 0.15)',
    animation: 'gradient-orb-1',
    duration: '20s',
  },
  {
    size: 350,
    top: '60%',
    left: '70%',
    color: 'rgba(99, 102, 241, 0.12)',
    animation: 'gradient-orb-2',
    duration: '25s',
  },
  {
    size: 300,
    top: '30%',
    left: '50%',
    color: 'rgba(139, 92, 246, 0.1)',
    animation: 'gradient-orb-3',
    duration: '22s',
  },
  {
    size: 250,
    top: '75%',
    left: '20%',
    color: 'rgba(99, 102, 241, 0.08)',
    animation: 'gradient-orb-1',
    duration: '28s',
  },
  {
    size: 200,
    top: '15%',
    left: '80%',
    color: 'rgba(168, 85, 247, 0.1)',
    animation: 'gradient-orb-2',
    duration: '18s',
  },
];

export default function FloatingElements() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className="gradient-orb absolute rounded-full blur-3xl motion-reduce:animate-none"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            top: orb.top,
            left: orb.left,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            animation: `${orb.animation} ${orb.duration} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
