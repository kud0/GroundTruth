'use client';
import { motion } from 'framer-motion';

interface TruthPrismLogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export default function TruthPrismLogo({
  size = 40,
  animated = true,
  className = ''
}: TruthPrismLogoProps) {
  // Pre-generate particle positions (consistent for SSR/CSR)
  const particles = [
    { cx: 25, cy: 80, opacity: 0.5, duration: 2.5 },
    { cx: 35, cy: 95, opacity: 0.6, duration: 3.2 },
    { cx: 45, cy: 75, opacity: 0.7, duration: 2.8 },
    { cx: 30, cy: 110, opacity: 0.4, duration: 3.5 },
    { cx: 40, cy: 120, opacity: 0.6, duration: 2.2 },
    { cx: 22, cy: 90, opacity: 0.5, duration: 3.8 },
    { cx: 48, cy: 105, opacity: 0.7, duration: 2.6 },
    { cx: 28, cy: 85, opacity: 0.6, duration: 3.1 },
    { cx: 38, cy: 115, opacity: 0.5, duration: 2.9 },
    { cx: 33, cy: 100, opacity: 0.7, duration: 3.3 },
    { cx: 43, cy: 88, opacity: 0.4, duration: 2.7 },
    { cx: 26, cy: 125, opacity: 0.6, duration: 3.6 },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradients for the prism */}
        <linearGradient id="prism-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="50%" stopColor="#764ba2" />
          <stop offset="100%" stopColor="#f093fb" />
        </linearGradient>

        {/* Beam gradients */}
        <linearGradient id="beam-purple" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#667eea" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#667eea" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beam-pink" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f093fb" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f093fb" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beam-blue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4facfe" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4facfe" stopOpacity="0" />
        </linearGradient>

        {/* Glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Input particles (chaotic) */}
      <g className="particles">
        {animated ? (
          <>
            {particles.map((particle, i) => (
              <motion.circle
                key={`particle-${i}`}
                cx={particle.cx}
                cy={particle.cy}
                r={2}
                fill="white"
                opacity={particle.opacity}
                initial={{ x: 0, opacity: 0 }}
                animate={{
                  x: [0, 10, 0],
                  opacity: [0.2, 0.8, 0.2]
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        ) : (
          <>
            {particles.map((particle, i) => (
              <circle
                key={`particle-${i}`}
                cx={particle.cx}
                cy={particle.cy}
                r={2}
                fill="white"
                opacity={0.6}
              />
            ))}
          </>
        )}
      </g>

      {/* Central Prism (3D hexagon) */}
      <g className="prism">
        {animated ? (
          <motion.g
            animate={{
              rotateY: [0, 15, 0, -15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: 'center' }}
          >
            {/* Front face */}
            <path
              d="M100,60 L140,80 L140,120 L100,140 L60,120 L60,80 Z"
              fill="url(#prism-gradient)"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              filter="url(#glow)"
            />

            {/* Blockchain texture overlay */}
            <g opacity="0.2">
              {[...Array(5)].map((_, i) => (
                <line
                  key={`hex-${i}`}
                  x1={70 + i * 15}
                  y1={80}
                  x2={70 + i * 15}
                  y2={120}
                  stroke="white"
                  strokeWidth="0.5"
                />
              ))}
            </g>
          </motion.g>
        ) : (
          <g>
            <path
              d="M100,60 L140,80 L140,120 L100,140 L60,120 L60,80 Z"
              fill="url(#prism-gradient)"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              filter="url(#glow)"
            />
          </g>
        )}
      </g>

      {/* Output beams (separated spectrum) */}
      <g className="beams">
        {animated ? (
          <>
            {/* Purple beam */}
            <motion.line
              x1="140"
              y1="85"
              x2="185"
              y2="70"
              stroke="url(#beam-purple)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />

            {/* Pink beam */}
            <motion.line
              x1="140"
              y1="100"
              x2="185"
              y2="100"
              stroke="url(#beam-pink)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.5,
                delay: 0.3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />

            {/* Blue beam */}
            <motion.line
              x1="140"
              y1="115"
              x2="185"
              y2="130"
              stroke="url(#beam-blue)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.5,
                delay: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          </>
        ) : (
          <>
            <line x1="140" y1="85" x2="185" y2="70" stroke="url(#beam-purple)" strokeWidth="3" strokeLinecap="round" />
            <line x1="140" y1="100" x2="185" y2="100" stroke="url(#beam-pink)" strokeWidth="3" strokeLinecap="round" />
            <line x1="140" y1="115" x2="185" y2="130" stroke="url(#beam-blue)" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  );
}
