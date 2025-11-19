'use client';

import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
  duration?: number;
  easing?: (t: number) => number;
  smoothWheel?: boolean;
  smoothTouch?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
}

export default function SmoothScroll({
  children,
  duration = 1.2,
  easing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel = true,
  smoothTouch = false,
  wheelMultiplier = 1,
  touchMultiplier = 2,
}: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Skip smooth scrolling if user prefers reduced motion
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration,
      easing,
      smoothWheel,
      wheelMultiplier,
      touchMultiplier,
      infinite: false,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      lerp: 0.1,
    });

    lenisRef.current = lenis;

    // Animation frame loop
    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    // Expose lenis instance globally for programmatic scrolling
    if (typeof window !== 'undefined') {
      (window as any).lenis = lenis;
    }

    // Cleanup
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      if (typeof window !== 'undefined') {
        delete (window as any).lenis;
      }
    };
  }, [duration, easing, smoothWheel, smoothTouch, wheelMultiplier, touchMultiplier]);

  return <>{children}</>;
}

// Helper hook for programmatic scrolling
export function useLenis() {
  const scrollTo = (target: string | number | HTMLElement, options?: any) => {
    if (typeof window !== 'undefined' && (window as any).lenis) {
      (window as any).lenis.scrollTo(target, options);
    }
  };

  const start = () => {
    if (typeof window !== 'undefined' && (window as any).lenis) {
      (window as any).lenis.start();
    }
  };

  const stop = () => {
    if (typeof window !== 'undefined' && (window as any).lenis) {
      (window as any).lenis.stop();
    }
  };

  return { scrollTo, start, stop };
}
