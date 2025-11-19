# ADR-001: Animation Framework Selection

## Status
Proposed

## Context
We need to select animation frameworks for our premium landing page transformation. The page requires:
- Complex 3D animations
- Scroll-triggered sequences
- Interactive hover effects
- High-performance 60 FPS animations
- Mobile-responsive animations
- Particle systems and effects

## Decision Drivers
1. Performance (60 FPS on desktop, 30 FPS on mobile)
2. Developer experience and maintainability
3. Bundle size impact
4. React 19 compatibility
5. TypeScript support
6. Animation complexity capabilities
7. Community support and documentation

## Options Considered

### Option 1: Framer Motion (Primary)
**Pros:**
- Native React integration with hooks
- Declarative API (variants system)
- Layout animations built-in
- Gesture support (@use-gesture compatible)
- Excellent TypeScript support
- Active development and community
- 30KB gzipped

**Cons:**
- Limited SVG morphing capabilities
- Complex timeline sequences require workarounds
- Some performance overhead for simple animations

**Use Cases:**
- Component enter/exit animations
- Layout transitions
- Scroll-triggered reveals
- Drag and drop interactions
- Page transitions

### Option 2: GSAP (Complementary)
**Pros:**
- Industry-standard timeline control
- Best-in-class SVG morphing
- ScrollTrigger plugin
- SplitText for typography
- Extremely performant
- Plugin ecosystem

**Cons:**
- Imperative API (less React-friendly)
- Commercial license for plugins ($99/year)
- 44KB gzipped (with plugins)
- Requires careful cleanup in React

**Use Cases:**
- Complex animation timelines
- SVG path morphing
- Advanced scroll effects
- Character-by-character text animations
- Fine-tuned easing curves

### Option 3: React Spring
**Pros:**
- Physics-based animations
- Small bundle (13KB)
- React-friendly hooks API
- Good performance

**Cons:**
- Less intuitive for non-physics animations
- Limited scroll integration
- Smaller community than FM or GSAP
- Less documentation

**Decision:**
Not selected as primary framework

### Option 4: Pure CSS Animations
**Pros:**
- Zero JavaScript overhead
- GPU-accelerated by default
- Simple animations perform best
- No bundle size impact

**Cons:**
- Limited interactivity
- No timeline control
- Difficult complex sequences
- Browser inconsistencies

**Use Cases:**
- Background effects (grids, gradients)
- Infinite loop animations
- Simple hover states

## Decision

**Primary Framework: Framer Motion**
- Use for all React component animations
- Layout transitions
- Gesture interactions
- Scroll reveals (useScroll, useInView)

**Complementary: GSAP**
- Complex timelines only
- SVG morphing
- ScrollTrigger for advanced scroll effects
- Text animations (SplitText)

**Baseline: CSS Animations**
- Background effects
- Infinite animations
- Simple hover states
- Keyframe animations

## Rationale

### Why Framer Motion as Primary?
1. **React Native:** Designed for React, uses hooks and components
2. **Declarative:** Variants system makes complex animations maintainable
3. **Performance:** Automatically optimizes for GPU acceleration
4. **TypeScript:** Full type safety out of the box
5. **Gestures:** Built-in support for drag, hover, tap
6. **Layout Animations:** Automatically animates layout changes
7. **Bundle Size:** Reasonable at 30KB for all features

### Why GSAP as Complementary?
1. **Timeline Control:** Superior for complex sequences
2. **SVG:** Best SVG morphing in the industry
3. **ScrollTrigger:** Most powerful scroll animation library
4. **SplitText:** Professional text animation effects
5. **Proven:** Battle-tested in award-winning sites

### Why Not React Spring?
- Physics-based approach doesn't fit all our use cases
- Framer Motion's API is more intuitive for our team
- Better documentation and community

## Implementation Strategy

### File Organization
```
/lib/animations/
├── framer/
│   ├── variants.ts         # Reusable Framer Motion variants
│   ├── transitions.ts      # Spring/tween configs
│   └── hooks.ts           # Custom animation hooks
├── gsap/
│   ├── timelines.ts       # GSAP timeline factories
│   ├── scrollTrigger.ts   # ScrollTrigger configs
│   └── effects.ts         # Reusable GSAP effects
└── css/
    └── keyframes.css      # CSS keyframe animations
```

### Usage Guidelines

#### Use Framer Motion For:
```typescript
// Component animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
>

// Scroll reveals
const ref = useRef(null)
const isInView = useInView(ref, { once: true })

<motion.div
  ref={ref}
  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
>

// Gestures
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

#### Use GSAP For:
```typescript
// Complex timelines
useEffect(() => {
  const tl = gsap.timeline()
  tl.to('.hero-title', { opacity: 1, duration: 1 })
    .to('.hero-subtitle', { opacity: 1, duration: 1 }, '-=0.5')
    .to('.hero-cta', { scale: 1, duration: 0.5 })

  return () => tl.kill()
}, [])

// SVG morphing
gsap.to('#path1', {
  morphSVG: '#path2',
  duration: 1,
  ease: 'power2.inOut'
})

// Advanced scroll
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.create({
  trigger: '.section',
  start: 'top center',
  end: 'bottom center',
  scrub: true,
  onUpdate: (self) => {
    // Custom scroll logic
  }
})
```

#### Use CSS For:
```css
/* Infinite animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.floating {
  animation: float 6s ease-in-out infinite;
}

/* GPU-accelerated transforms */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}
```

## Performance Considerations

### Bundle Size Impact
```
Framer Motion: ~30KB gzipped
GSAP Core: ~25KB gzipped
GSAP ScrollTrigger: +8KB gzipped
GSAP SplitText: +5KB gzipped
Total: ~68KB gzipped
```

### Load Strategy
```typescript
// Lazy load GSAP
const loadGSAP = async () => {
  const [gsap, { ScrollTrigger }, { SplitText }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/SplitText')
  ])
  return { gsap, ScrollTrigger, SplitText }
}

// Use only when needed
useEffect(() => {
  if (needsComplexAnimation) {
    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      // Setup GSAP animations
    })
  }
}, [needsComplexAnimation])
```

### Animation Performance Budget
- Max 16.67ms per frame (60 FPS)
- Use transform and opacity only
- Avoid animating: width, height, top, left, margin, padding
- Use will-change sparingly
- Limit concurrent animations to 5-10

## Migration Path

### Phase 1: Setup (Week 1)
1. Install Framer Motion
2. Create animation variants library
3. Setup TypeScript types
4. Create custom hooks

### Phase 2: Core Animations (Week 2-4)
1. Migrate hero section to Framer Motion
2. Implement scroll reveals
3. Add hover interactions
4. Create reusable components

### Phase 3: Advanced Effects (Week 5-6)
1. Install GSAP (if needed)
2. Implement complex timelines
3. Add ScrollTrigger effects
4. Setup text animations

### Phase 4: Optimization (Week 7-8)
1. Performance profiling
2. Reduce animation complexity on mobile
3. Implement reduced motion support
4. Bundle size optimization

## Testing Strategy

### Performance Testing
```typescript
// Measure animation FPS
const measureFPS = () => {
  let lastTime = performance.now()
  let frames = 0

  const loop = () => {
    const currentTime = performance.now()
    frames++

    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (currentTime - lastTime))
      console.log(`FPS: ${fps}`)
      frames = 0
      lastTime = currentTime
    }

    requestAnimationFrame(loop)
  }

  loop()
}
```

### Visual Regression Testing
```typescript
// Test animation states
test('hero animates correctly', async () => {
  const { container } = render(<Hero />)

  // Initial state
  expect(container).toMatchSnapshot('hero-initial')

  // After animation
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
  })

  expect(container).toMatchSnapshot('hero-animated')
})
```

## Accessibility

### Reduced Motion Support
```typescript
import { useReducedMotion } from 'framer-motion'

const shouldReduceMotion = useReducedMotion()

const variants = {
  initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
  animate: { opacity: 1, y: 0 }
}
```

### ARIA Attributes
```typescript
<motion.div
  role="region"
  aria-label="Animated content"
  aria-live={isAnimating ? "polite" : "off"}
>
```

## Consequences

### Positive
- Consistent animation API across components
- TypeScript safety for all animations
- Optimal performance with GPU acceleration
- Maintainable variant system
- Easy to test and debug

### Negative
- Two animation libraries increase bundle size
- Team needs to learn both Framer Motion and GSAP
- Commercial license cost for GSAP plugins ($99/year)
- Potential over-animation if not careful

### Neutral
- Need to document when to use each library
- Requires performance monitoring
- May need to refactor some animations

## References
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [GSAP Documentation](https://greensock.com/docs/)
- [Web Animations Performance](https://web.dev/animations/)
- [Delorean Animation Analysis](https://delorean.ai)
- [AX1 Animation Breakdown](https://ax1.io)

## Decision Date
2025-11-18

## Reviewers
- Frontend Lead
- Performance Engineer
- UX Designer
