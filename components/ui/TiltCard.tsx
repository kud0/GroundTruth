'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, ReactNode, CSSProperties } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltIntensity?: number;
  glareIntensity?: number;
  shadowIntensity?: number;
  scale?: number;
  transitionSpeed?: number;
  borderRadius?: string;
  style?: CSSProperties;
}

export default function TiltCard({
  children,
  className = '',
  tiltIntensity = 15,
  glareIntensity = 0.3,
  shadowIntensity = 25,
  scale = 1.02,
  transitionSpeed = 0.15,
  borderRadius = '24px',
  style = {},
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring configuration for smooth, premium feel
  const springConfig = {
    damping: 25,
    stiffness: 200,
    mass: 0.5,
  };

  // Apply spring physics to mouse movements
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]), springConfig);

  // Glare/shine effect position
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  // Shadow follows the tilt
  const shadowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-shadowIntensity, shadowIntensity]), springConfig);
  const shadowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-shadowIntensity, shadowIntensity]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    // Normalize to -0.5 to 0.5
    const normalizedX = (mouseXPos / width) - 0.5;
    const normalizedY = (mouseYPos / height) - 0.5;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={false}
      animate={{
        scale: isHovered ? scale : 1,
      }}
      transition={{
        duration: transitionSpeed,
        ease: 'easeOut',
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          borderRadius,
        }}
        transition={{
          type: 'spring',
          ...springConfig,
        }}
      >
        {/* Main card content with glass morphism */}
        <div
          className="relative w-full h-full overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20"
          style={{
            borderRadius,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Gradient shine overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius,
              background: `radial-gradient(600px circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,${glareIntensity}), transparent 40%)`,
              opacity: isHovered ? 1 : 0,
              transition: `opacity ${transitionSpeed}s ease`,
            }}
          />

          {/* Gradient reflection effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              borderRadius,
              background: `linear-gradient(115deg, transparent 20%, rgba(139, 92, 246, 0.15) 40%, rgba(59, 130, 246, 0.15) 60%, transparent 80%)`,
              backgroundSize: '200% 200%',
              backgroundPositionX: useTransform(glareX, [0, 100], ['0%', '100%']),
              backgroundPositionY: useTransform(glareY, [0, 100], ['0%', '100%']),
              mixBlendMode: 'overlay',
            }}
          />

          {/* Inner glow */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              borderRadius,
              boxShadow: 'inset 0 0 60px rgba(139, 92, 246, 0.2), inset 0 0 30px rgba(59, 130, 246, 0.15)',
            }}
          />

          {/* Content */}
          <div
            className="relative z-10 w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {children}
          </div>
        </div>

        {/* Dynamic shadow that follows tilt */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-[inherit] opacity-80"
          style={{
            borderRadius,
            filter: 'blur(30px)',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.4))',
            x: shadowX,
            y: shadowY,
            scale: isHovered ? 1.05 : 0.95,
            opacity: isHovered ? 0.8 : 0.4,
          }}
          transition={{
            duration: transitionSpeed,
          }}
        />
      </motion.div>

      {/* Reduced motion fallback */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
