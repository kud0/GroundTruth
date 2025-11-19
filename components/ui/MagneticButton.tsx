'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  magneticStrength?: number;
  glowIntensity?: 'low' | 'medium' | 'high';
  className?: string;
}

const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      magneticStrength = 0.4,
      glowIntensity = 'medium',
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Motion values for magnetic effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring configuration for smooth animations
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    // Check for reduced motion preference
    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (prefersReducedMotion || disabled) return;

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Apply magnetic effect
      x.set(distanceX * magneticStrength);
      y.set(distanceY * magneticStrength);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    // Variant styles
    const variantStyles = {
      primary: `
        bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
        hover:from-blue-500 hover:via-purple-500 hover:to-pink-500
        text-white border-transparent
        shadow-lg shadow-blue-500/30
      `,
      secondary: `
        bg-gradient-to-r from-gray-800 to-gray-900
        hover:from-gray-700 hover:to-gray-800
        text-white border-gray-700
        shadow-lg shadow-gray-900/50
      `,
      ghost: `
        bg-transparent border-2
        border-gradient-to-r from-blue-500 via-purple-500 to-pink-500
        text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
        hover:bg-gradient-to-r hover:from-blue-600/10 hover:via-purple-600/10 hover:to-pink-600/10
        shadow-none
      `,
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    // Glow intensity
    const glowStyles = {
      low: 'hover:shadow-xl',
      medium: 'hover:shadow-2xl',
      high: 'hover:shadow-[0_0_50px_rgba(139,92,246,0.6)]',
    };

    const { onClick, onMouseDown, onMouseUp, type, ...restProps } = props;

    return (
      <motion.button
        ref={(node) => {
          // Handle both refs
          buttonRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`
          relative overflow-hidden rounded-full
          font-semibold tracking-wide
          transition-all duration-300 ease-out
          transform-gpu
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${glowStyles[glowIntensity]}
          ${className}
        `}
        style={{
          x: prefersReducedMotion ? 0 : springX,
          y: prefersReducedMotion ? 0 : springY,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        type={type}
        disabled={disabled}
        whileHover={
          prefersReducedMotion || disabled
            ? {}
            : {
                scale: 1.05,
                transition: { duration: 0.2 },
              }
        }
        whileTap={
          prefersReducedMotion || disabled
            ? {}
            : {
                scale: 0.95,
                transition: { duration: 0.1 },
              }
        }
      >
        {/* Glow overlay */}
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none"
          animate={{
            opacity: isHovered && !disabled ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`
              absolute inset-0 rounded-full blur-xl
              ${
                variant === 'primary'
                  ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
                  : variant === 'secondary'
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700'
                  : 'bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20'
              }
            `}
          />
        </motion.div>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none"
          animate={{
            opacity: isHovered && !disabled ? [0, 0.5, 0] : 0,
            x: isHovered && !disabled ? ['-100%', '100%'] : '-100%',
          }}
          transition={{
            duration: 1.5,
            repeat: isHovered ? Infinity : 0,
            ease: 'linear',
          }}
        >
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
        </motion.div>

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>

        {/* Border glow for ghost variant */}
        {variant === 'ghost' && (
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 pointer-events-none"
            animate={{
              opacity: isHovered && !disabled ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-sm" />
          </motion.div>
        )}
      </motion.button>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';

export default MagneticButton;
