'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function AnimatedBackground() {
  // Generate particle positions only on client to avoid hydration mismatch
  const [particles, setParticles] = useState<Particle[]>([]);
  const [connections, setConnections] = useState<Array<[number, number]>>([]);

  useEffect(() => {
    // Generate particles only on client side
    const initialParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
    }));
    setParticles(initialParticles);

    // Animation loop to move particles and calculate connections
    let animationFrame: number;
    const animate = () => {
      setParticles((prevParticles) => {
        const newParticles = prevParticles.map((p) => {
          let newX = p.x + p.vx;
          let newY = p.y + p.vy;
          let newVx = p.vx;
          let newVy = p.vy;

          // Bounce off edges
          if (newX <= 0 || newX >= 100) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(100, newX));
          }
          if (newY <= 0 || newY >= 100) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(100, newY));
          }

          return { ...p, x: newX, y: newY, vx: newVx, vy: newVy };
        });

        // Calculate connections (particles within 20% distance)
        const newConnections: Array<[number, number]> = [];
        for (let i = 0; i < newParticles.length; i++) {
          for (let j = i + 1; j < newParticles.length; j++) {
            const dx = newParticles[i].x - newParticles[j].x;
            const dy = newParticles[i].y - newParticles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 25) {
              newConnections.push([i, j]);
            }
          }
        }
        setConnections(newConnections);

        return newParticles;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50 dark:from-[#0a0118] dark:via-[#1a0b2e] dark:to-[#0d1829]">
      {/* LIGHT MODE: SUPER VISIBLE gradient orbs */}
      {/* DARK MODE: Subtle deep purple gradient */}

      {/* Top-left Purple orb */}
      <motion.div
        className="absolute -top-48 -left-48 w-[600px] h-[600px]"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-full h-full rounded-full bg-purple-200/20 dark:bg-purple-600/35 blur-[120px]" />
      </motion.div>

      {/* Bottom-right Blue orb */}
      <motion.div
        className="absolute -bottom-48 -right-48 w-[700px] h-[700px]"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-full h-full rounded-full bg-blue-200/20 dark:bg-blue-600/35 blur-[120px]" />
      </motion.div>

      {/* Center Pink orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="w-full h-full rounded-full bg-pink-200/15 dark:bg-purple-500/30 blur-[120px]" />
      </motion.div>

      {/* Top-right Cyan orb */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[550px] h-[550px]"
        animate={{
          scale: [1.1, 0.9, 1.1],
          x: [0, -80, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-full h-full rounded-full bg-cyan-200/15 dark:bg-indigo-600/30 blur-[120px]" />
      </motion.div>

      {/* SVG for connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map(([i, j], idx) => {
          const p1 = particles[i];
          const p2 = particles[j];
          if (!p1 || !p2) return null;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const opacity = Math.max(0, 1 - distance / 25);

          return (
            <line
              key={`${i}-${j}-${idx}`}
              x1={`${p1.x}%`}
              y1={`${p1.y}%`}
              x2={`${p2.x}%`}
              y2={`${p2.y}%`}
              stroke="currentColor"
              strokeWidth="1"
              opacity={opacity * 0.3}
              className="stroke-purple-400 dark:stroke-purple-400/50"
            />
          );
        })}
      </svg>

      {/* Blockchain nodes (particles) */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full bg-purple-400/60 dark:bg-purple-400/40"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Outer ring for "node" effect */}
          <div className="absolute inset-0 rounded-full border border-purple-500/20 dark:border-purple-400/15 scale-150" />
          <div className="absolute inset-0 rounded-full border border-purple-500/10 dark:border-purple-400/10 scale-200 animate-ping" style={{ animationDuration: '3s' }} />
        </motion.div>
      ))}

      {/* More visible grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,.08)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(168,85,247,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,.1)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />

      {/* Animated gradient mesh */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(168,85,247,0.1), transparent 50%), radial-gradient(circle at 80% 50%, rgba(59,130,246,0.1), transparent 50%)',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
