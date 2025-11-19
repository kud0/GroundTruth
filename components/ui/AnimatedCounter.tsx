'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export interface AnimatedCounterProps {
  /**
   * The target number to count to
   */
  value: number;

  /**
   * Number of decimal places to display
   * @default 0
   */
  decimals?: number;

  /**
   * Duration of the animation in seconds
   * @default 2
   */
  duration?: number;

  /**
   * Prefix to add before the number (e.g., '$')
   */
  prefix?: string;

  /**
   * Suffix to add after the number (e.g., '%', 'M', 'K')
   */
  suffix?: string;

  /**
   * Whether to use thousand separators (,)
   * @default true
   */
  useGrouping?: boolean;

  /**
   * Custom className for styling
   */
  className?: string;

  /**
   * Delay before animation starts (in seconds)
   * @default 0
   */
  delay?: number;

  /**
   * Whether to trigger animation only once
   * @default true
   */
  once?: boolean;

  /**
   * Custom formatting function
   */
  formatter?: (value: number) => string;

  /**
   * Threshold for IntersectionObserver (0-1)
   * @default 0.1
   */
  threshold?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  decimals = 0,
  duration = 2,
  prefix = '',
  suffix = '',
  useGrouping = true,
  className = '',
  delay = 0,
  once = true,
  formatter,
  threshold = 0.1,
}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  // Spring animation for smooth counting
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  // Transform spring value to rounded number
  const display = useTransform(spring, (current) => {
    if (formatter) {
      return formatter(current);
    }

    const rounded = decimals > 0
      ? current.toFixed(decimals)
      : Math.round(current).toString();

    let formattedNumber = rounded;

    // Add thousand separators
    if (useGrouping) {
      const parts = rounded.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      formattedNumber = parts.join('.');
    }

    return `${prefix}${formattedNumber}${suffix}`;
  });

  // IntersectionObserver setup
  useEffect(() => {
    if (!counterRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);

          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin: '0px',
      }
    );

    observer.observe(counterRef.current);

    return () => {
      observer.disconnect();
    };
  }, [once, threshold]);

  // Trigger animation when in view
  useEffect(() => {
    if (isInView && (!hasAnimated || !once)) {
      const timer = setTimeout(() => {
        spring.set(value);
        setHasAnimated(true);
      }, delay * 1000);

      return () => clearTimeout(timer);
    } else if (!isInView && !once) {
      spring.set(0);
    }
  }, [isInView, value, delay, spring, once, hasAnimated]);

  return (
    <motion.span
      ref={counterRef}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {display}
    </motion.span>
  );
};

export default AnimatedCounter;

// Convenience components for common use cases

export const CurrencyCounter: React.FC<Omit<AnimatedCounterProps, 'prefix'> & { currency?: string }> = ({
  currency = '$',
  ...props
}) => <AnimatedCounter prefix={currency} {...props} />;

export const PercentageCounter: React.FC<Omit<AnimatedCounterProps, 'suffix'>> = (props) => (
  <AnimatedCounter suffix="%" {...props} />
);

export const CompactNumberCounter: React.FC<AnimatedCounterProps> = ({ value, ...props }) => {
  const formatter = (num: number) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(0);
  };

  return <AnimatedCounter value={value} formatter={formatter} {...props} />;
};
