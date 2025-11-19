'use client';
import { motion } from 'framer-motion';

interface ConsensusSpiralLogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export default function ConsensusSpiralLogo({
  size = 40,
  animated = true,
  className = ''
}: ConsensusSpiralLogoProps) {
  // Generate fibonacci spiral points
  const generateSpiralPoints = (numPoints: number) => {
    const points = [];
    const goldenRatio = 1.618;
    const centerX = 100;
    const centerY = 100;

    for (let i = 0; i < numPoints; i++) {
      const t = i * 15; // Angle increment
      const r = Math.pow(goldenRatio, t / 180); // Fibonacci spiral
      const x = centerX + r * Math.cos(t * Math.PI / 180);
      const y = centerY + r * Math.sin(t * Math.PI / 180);
      const progress = i / numPoints; // 0 to 1

      points.push({ x, y, progress, delay: i * 0.05 });
    }

    return points;
  };

  const spiralPoints = generateSpiralPoints(40);

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
        {/* Gradient from uncertainty to certainty */}
        <radialGradient id="spiral-gradient">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#4facfe" />
          <stop offset="100%" stopColor="#667eea" />
        </radialGradient>

        {/* Glow for center point */}
        <filter id="center-glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Spiral path (subtle guide) */}
      <path
        d={`M ${spiralPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        fill="none"
      />

      {/* Spiral dots */}
      <g className="spiral-dots">
        {spiralPoints.map((point, i) => {
          const dotSize = 2 + point.progress * 4; // Grow as approach center
          const opacity = 0.3 + point.progress * 0.7; // Brighten toward center

          return animated ? (
            <motion.circle
              key={`dot-${i}`}
              cx={point.x}
              cy={point.y}
              r={dotSize}
              fill={`hsl(${220 + point.progress * 40}, 70%, ${50 + point.progress * 30}%)`}
              opacity={opacity}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [opacity * 0.5, opacity, opacity * 0.5]
              }}
              transition={{
                duration: 2,
                delay: point.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ) : (
            <circle
              key={`dot-${i}`}
              cx={point.x}
              cy={point.y}
              r={dotSize}
              fill={`hsl(${220 + point.progress * 40}, 70%, ${50 + point.progress * 30}%)`}
              opacity={opacity}
            />
          );
        })}
      </g>

      {/* Center "truth point" - diamond */}
      <g className="truth-point">
        {animated ? (
          <motion.g
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: '100px 100px' }}
          >
            <path
              d="M100,90 L110,100 L100,110 L90,100 Z"
              fill="white"
              filter="url(#center-glow)"
            />
          </motion.g>
        ) : (
          <path
            d="M100,90 L110,100 L100,110 L90,100 Z"
            fill="white"
            filter="url(#center-glow)"
          />
        )}
      </g>

      {/* Rotating spiral container (subtle rotation) */}
      {animated && (
        <motion.g
          animate={{ rotate: 360 }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ transformOrigin: '100px 100px' }}
        >
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
            fill="none"
          />
        </motion.g>
      )}
    </svg>
  );
}
