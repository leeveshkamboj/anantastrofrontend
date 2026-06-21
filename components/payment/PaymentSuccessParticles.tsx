'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useMotion } from '@/components/motion/MotionProvider';

const PARTICLE_COUNT = 18;

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  rotate: number;
};

function buildParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
    id,
    x: (Math.random() - 0.5) * 280,
    y: (Math.random() - 0.5) * 220 - 40,
    size: 4 + Math.random() * 6,
    delay: Math.random() * 0.25,
    rotate: Math.random() * 360,
  }));
}

export function PaymentSuccessParticles({ active }: { active: boolean }) {
  const { reduced } = useMotion();
  const particles = useMemo(() => buildParticles(), []);

  if (!active || reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full bg-astro-orange/80 shadow-[0_0_12px_rgba(232,165,75,0.45)]"
          style={{ width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0.4],
            rotate: p.rotate,
          }}
          transition={{
            duration: 1.1,
            delay: 0.35 + p.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  );
}
