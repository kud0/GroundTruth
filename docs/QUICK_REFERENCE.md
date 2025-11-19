# Premium Landing Page - Quick Reference Guide

## Installation Commands

### One-Time Setup
```bash
cd /Users/alexsolecarretero/Public/projects/crypto-ideas/crypto-coin/frontend

# Install all dependencies
npm install framer-motion @use-gesture/react \
  three @react-three/fiber @react-three/drei @react-three/postprocessing \
  tsparticles @tsparticles/react @tsparticles/slim \
  lenis locomotive-scroll@beta \
  popmotion clsx tailwind-merge

# Dev dependencies
npm install --save-dev @types/three leva r3f-perf
```

---

## Common Component Patterns

### 1. Animated Component (Framer Motion)
```typescript
import { motion } from 'framer-motion'

export function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 backdrop-blur-md p-6 rounded-2xl"
    >
      Content
    </motion.div>
  )
}
```

### 2. Scroll Reveal
```typescript
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function ScrollReveal({ children }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}
```

### 3. 3D Object (React Three Fiber)
```typescript
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function RotatingCube() {
  const meshRef = useRef()

  useFrame((state) => {
    meshRef.current.rotation.x += 0.01
    meshRef.current.rotation.y += 0.01
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#a855f7" />
    </mesh>
  )
}
```

### 4. Glass Card
```typescript
export function GlassCard({ children, className = '' }) {
  return (
    <div className={`
      bg-white/5
      backdrop-blur-md
      border border-white/10
      rounded-2xl
      p-6
      hover:bg-white/10
      hover:border-white/20
      transition-all
      duration-300
      ${className}
    `}>
      {children}
    </div>
  )
}
```

### 5. Gradient Text
```typescript
export function GradientText({ children, className = '' }) {
  return (
    <span className={`
      bg-gradient-to-r
      from-purple-400
      via-pink-400
      to-blue-400
      bg-clip-text
      text-transparent
      ${className}
    `}>
      {children}
    </span>
  )
}
```

---

## Animation Variants Library

### Fade Animations
```typescript
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
}
```

### Scale Animations
```typescript
export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
}

export const scaleUp = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  exit: { scale: 0 }
}
```

### Slide Animations
```typescript
export const slideInLeft = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 }
}

export const slideInRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }
}
```

### 3D Animations
```typescript
export const rotateIn3D = {
  initial: {
    opacity: 0,
    rotateX: -90,
    transformPerspective: 1000
  },
  animate: {
    opacity: 1,
    rotateX: 0
  }
}

export const flipIn = {
  initial: {
    opacity: 0,
    rotateY: -180,
    transformPerspective: 1000
  },
  animate: {
    opacity: 1,
    rotateY: 0
  }
}
```

---

## Transition Presets

### Spring Transitions
```typescript
export const spring = {
  type: "spring",
  stiffness: 400,
  damping: 30
}

export const smoothSpring = {
  type: "spring",
  stiffness: 100,
  damping: 20
}

export const bouncy = {
  type: "spring",
  stiffness: 300,
  damping: 10
}
```

### Tween Transitions
```typescript
export const tween = {
  type: "tween",
  duration: 0.3,
  ease: "easeInOut"
}

export const slowTween = {
  type: "tween",
  duration: 0.6,
  ease: "easeInOut"
}
```

---

## Tailwind Custom Classes

### Glassmorphism
```html
<!-- Basic glass -->
<div class="bg-white/5 backdrop-blur-md border border-white/10"></div>

<!-- Glass with hover -->
<div class="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"></div>
```

### Gradient Backgrounds
```html
<!-- Purple to pink -->
<div class="bg-gradient-to-r from-purple-500 to-pink-500"></div>

<!-- Multi-color -->
<div class="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"></div>

<!-- Radial -->
<div class="bg-gradient-radial from-purple-500/20 to-transparent"></div>
```

### Text Gradients
```html
<!-- Simple gradient -->
<h1 class="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"></h1>

<!-- Multi-color -->
<h1 class="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"></h1>
```

### 3D Effects
```html
<!-- Perspective container -->
<div class="transform-style-3d perspective-1000"></div>

<!-- 3D transform -->
<div class="transform rotate-y-45 translate-z-10"></div>
```

### Animations
```html
<!-- Float animation -->
<div class="animate-float"></div>

<!-- Glow pulse -->
<div class="animate-glow-pulse"></div>

<!-- Gradient shift -->
<div class="animate-gradient-shift bg-gradient-to-r from-purple-500 to-pink-500 bg-[length:200%_100%]"></div>
```

---

## Hooks Quick Reference

### useDeviceCapabilities
```typescript
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'

const { isMobile, isTablet, isDesktop, isHighPerformance } = useDeviceCapabilities()

// Use for adaptive rendering
{!isMobile && <Heavy3DScene />}
{isMobile && <Lightweight2D />}
```

### useScrollProgress
```typescript
import { useScroll, useTransform } from 'framer-motion'

const { scrollYProgress } = useScroll()
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])

<motion.div style={{ opacity }} />
```

### useInView
```typescript
import { useInView } from 'framer-motion'

const ref = useRef(null)
const isInView = useInView(ref, {
  once: true,      // Trigger only once
  amount: 0.3,     // 30% visible
  margin: "-100px" // Trigger 100px before visible
})
```

### useGesture (Drag)
```typescript
import { useDrag } from '@use-gesture/react'

const bind = useDrag(({ offset: [x, y] }) => {
  // Handle drag
})

<div {...bind()} />
```

---

## Performance Optimization Checklist

### Image Optimization
```typescript
import Image from 'next/image'

// Above the fold
<Image
  src="/hero.webp"
  alt="Hero"
  width={1920}
  height={1080}
  priority
  quality={90}
/>

// Below the fold
<Image
  src="/feature.webp"
  alt="Feature"
  width={800}
  height={600}
  loading="lazy"
  quality={80}
/>
```

### Lazy Load Components
```typescript
import dynamic from 'next/dynamic'

const Heavy3D = dynamic(
  () => import('@/components/3d/Scene'),
  {
    ssr: false,
    loading: () => <Skeleton />
  }
)
```

### Memoization
```typescript
import { memo, useMemo } from 'react'

// Memoize component
export const ExpensiveComponent = memo(({ data }) => {
  return <div>{data}</div>
})

// Memoize value
const expensiveValue = useMemo(() => {
  return computeExpensive(input)
}, [input])
```

### GPU Acceleration
```typescript
// Force GPU acceleration
const gpuStyles = {
  transform: 'translateZ(0)',
  willChange: 'transform'
}

// Use transform, not position
<motion.div animate={{ x: 100, y: 100 }} /> // ✅ GPU
<motion.div animate={{ left: 100, top: 100 }} /> // ❌ CPU
```

---

## Common Issues & Solutions

### Issue: 3D Scene Not Rendering

**Solution:**
```typescript
// Check WebGL support
const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl')
if (!gl) {
  return <CSS3DFallback />
}
```

### Issue: Animations Janky

**Solution:**
```typescript
// Use transform and opacity only
// Avoid: width, height, top, left, margin, padding

// ❌ Bad
<motion.div animate={{ width: 200, height: 200 }} />

// ✅ Good
<motion.div animate={{ scale: 2 }} />
```

### Issue: Bundle Too Large

**Solution:**
```typescript
// Dynamic imports
const Component = dynamic(() => import('./Component'), { ssr: false })

// Tree shaking in next.config.js
experimental: {
  optimizePackageImports: ['framer-motion', '@react-three/fiber']
}
```

### Issue: Mobile Performance Poor

**Solution:**
```typescript
// Reduce quality on mobile
const particleCount = isMobile ? 100 : 1000
const dpr = isMobile ? 1 : 2
const shadows = !isMobile
const postProcessing = !isMobile && isHighPerformance
```

### Issue: Layout Shift (CLS)

**Solution:**
```typescript
// Reserve space for dynamic content
<div style={{ minHeight: '400px' }}>
  {loading ? <Skeleton /> : <Content />}
</div>

// Use aspect-ratio for images
<div className="aspect-video">
  <Image src={src} fill />
</div>
```

---

## Testing Commands

### Performance Testing
```bash
# Lighthouse
npx lighthouse http://localhost:3000 --view

# Bundle analysis
npm run build
# Check .next/analyze/client.html

# Performance profiling
# Chrome DevTools → Performance → Record
```

### Accessibility Testing
```bash
# axe DevTools browser extension
# Or use axe-core
npm install --save-dev @axe-core/react

# In development
if (process.env.NODE_ENV !== 'production') {
  const axe = require('@axe-core/react')
  axe(React, ReactDOM, 1000)
}
```

### Visual Regression
```bash
# Percy (if configured)
npx percy snapshot [URL]

# Chromatic (if configured)
npx chromatic --project-token=[TOKEN]
```

---

## Deployment

### Build & Deploy
```bash
# Build
npm run build

# Test production build locally
npm run start

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

### Environment Variables
```bash
# Create .env.local
NEXT_PUBLIC_SOLANA_RPC_URL=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Useful Resources

### Documentation
- [Framer Motion](https://www.framer.com/motion/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Next.js](https://nextjs.org/docs)

### Tools
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [r3f-perf](https://github.com/RenaudRohlinger/r3f-perf)

### Inspiration
- [Awwwards](https://www.awwwards.com/)
- [FWA](https://thefwa.com/)
- [CSS Design Awards](https://www.cssdesignawards.com/)

---

## Color Palette

### Primary Colors
```css
/* Purple */
--purple-50: #faf5ff;
--purple-400: #c084fc;
--purple-500: #a855f7;
--purple-600: #9333ea;

/* Pink */
--pink-400: #f472b6;
--pink-500: #ec4899;

/* Blue */
--blue-400: #60a5fa;
--blue-500: #3b82f6;

/* Cyan */
--cyan-400: #22d3ee;
--cyan-500: #06b6d4;

/* Emerald */
--emerald-400: #34d399;
--emerald-500: #10b981;
```

### Glass Colors
```css
--glass-white: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-hover: rgba(255, 255, 255, 0.1);
```

---

## File Naming Conventions

### Components
```
PascalCase.tsx
- PrimaryButton.tsx
- GlassmorphicCard.tsx
- HeroSection.tsx
```

### Hooks
```
camelCase.ts (with 'use' prefix)
- useDeviceCapabilities.ts
- useScrollProgress.ts
- useAnimationFrame.ts
```

### Utilities
```
camelCase.ts
- animations.ts
- utils.ts
- constants.ts
```

### Types
```
PascalCase.ts (with 'types' suffix or in types folder)
- animationTypes.ts
- componentTypes.ts
- /types/index.ts
```

---

## Git Workflow

### Branch Naming
```
feature/hero-3d-scene
fix/animation-performance
refactor/button-components
docs/update-readme
```

### Commit Messages
```
feat: Add 3D blockchain node component
fix: Improve scroll performance on mobile
refactor: Extract animation variants
docs: Update implementation checklist
perf: Reduce bundle size with code splitting
```

---

## Need Help?

### Documentation
1. Check `/docs/PREMIUM_LANDING_ARCHITECTURE.md`
2. Check `/docs/ADR-001-ANIMATION-FRAMEWORK.md`
3. Check `/docs/ADR-002-3D-RENDERING.md`
4. Check `/docs/COMPONENT_ARCHITECTURE.md`

### Common Questions
- **Q: Which animation library should I use?**
  - A: Framer Motion for React components, GSAP for complex timelines

- **Q: How do I optimize for mobile?**
  - A: Use `useDeviceCapabilities` hook and reduce complexity

- **Q: My 3D scene is slow, what do I do?**
  - A: Check particle count, disable shadows on mobile, use LOD

- **Q: How do I test performance?**
  - A: Use Lighthouse, Chrome DevTools Performance, r3f-perf

---

**Last Updated:** 2025-11-18
**Version:** 1.0.0
