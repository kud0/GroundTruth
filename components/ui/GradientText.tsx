'use client';

import React from 'react';

export type GradientPreset =
  | 'purple'
  | 'blue'
  | 'rainbow'
  | 'sunset'
  | 'ocean'
  | 'fire'
  | 'cyber'
  | 'emerald'
  | 'gold'
  | 'cosmic';

export type AnimationSpeed = 'slow' | 'normal' | 'fast';

export interface GradientTextProps {
  children: React.ReactNode;
  preset?: GradientPreset;
  customGradient?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p' | 'div';
  className?: string;
  speed?: AnimationSpeed;
  animated?: boolean;
}

const GRADIENT_PRESETS: Record<GradientPreset, string> = {
  purple: 'linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #667eea 75%, #764ba2 100%)',
  blue: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 25%, #43e97b 50%, #4facfe 75%, #00f2fe 100%)',
  rainbow: 'linear-gradient(90deg, #ff0080 0%, #ff8c00 20%, #40e0d0 40%, #0080ff 60%, #8000ff 80%, #ff0080 100%)',
  sunset: 'linear-gradient(90deg, #fa709a 0%, #fee140 25%, #fa709a 50%, #fee140 75%, #fa709a 100%)',
  ocean: 'linear-gradient(90deg, #2e3192 0%, #1bffff 25%, #2e3192 50%, #1bffff 75%, #2e3192 100%)',
  fire: 'linear-gradient(90deg, #f12711 0%, #f5af19 25%, #f12711 50%, #f5af19 75%, #f12711 100%)',
  cyber: 'linear-gradient(90deg, #00d2ff 0%, #3a47d5 25%, #00d2ff 50%, #3a47d5 75%, #00d2ff 100%)',
  emerald: 'linear-gradient(90deg, #11998e 0%, #38ef7d 25%, #11998e 50%, #38ef7d 75%, #11998e 100%)',
  gold: 'linear-gradient(90deg, #f7971e 0%, #ffd200 25%, #f7971e 50%, #ffd200 75%, #f7971e 100%)',
  cosmic: 'linear-gradient(90deg, #8e2de2 0%, #4a00e0 25%, #8e2de2 50%, #4a00e0 75%, #8e2de2 100%)',
};

const ANIMATION_SPEEDS: Record<AnimationSpeed, string> = {
  slow: '8s',
  normal: '4s',
  fast: '2s',
};

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  preset = 'purple',
  customGradient,
  as: Component = 'span',
  className = '',
  speed = 'normal',
  animated = true,
}) => {
  const gradient = customGradient || GRADIENT_PRESETS[preset];
  const animationDuration = ANIMATION_SPEEDS[speed];

  const styles: React.CSSProperties = {
    background: gradient,
    backgroundSize: animated ? '200% 100%' : '100% 100%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: animated ? `gradientShift ${animationDuration} linear infinite` : 'none',
  };

  return (
    <>
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      `}</style>
      <Component className={className} style={styles}>
        {children}
      </Component>
    </>
  );
};

export default GradientText;
