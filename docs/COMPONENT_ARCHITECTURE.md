# Component Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Landing Page                             │
│                      (app/page.tsx)                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        ┌───────▼──────┐               ┌───────▼──────┐
        │  Layout.tsx  │               │ Providers    │
        │  (Root)      │               │              │
        └──────────────┘               └──────────────┘
                │                               │
                │                     ┌─────────┴──────────┐
                │                     │                    │
                │           ┌─────────▼─────────┐  ┌──────▼──────┐
                │           │ WalletProvider    │  │ ThemeProvider│
                │           └───────────────────┘  └─────────────┘
                │
    ┌───────────┴───────────────────────────────────────┐
    │                                                   │
┌───▼────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐  ┌▼──────┐
│ Hero   │  │ Features │  │ Markets │  │ HowItWorks│  │ CTA  │
│ Section│  │ Section  │  │ Section │  │  Section  │  │Section│
└────────┘  └──────────┘  └─────────┘  └───────────┘  └──────┘
```

## Hero Section Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Hero Section                             │
│                  (sections/HeroSection.tsx)                   │
└──────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐  ┌──────▼──────┐  ┌───────▼────────┐
│ Background     │  │   Content   │  │   3D Canvas    │
│   Layers       │  │    Layer    │  │    Layer       │
└────────────────┘  └─────────────┘  └────────────────┘
        │                  │                  │
        │                  │                  │
┌───────┴────────┐  ┌──────┴──────┐  ┌───────┴────────┐
│                │  │             │  │                │
│ ┌────────────┐ │  │ ┌─────────┐ │  │ ┌────────────┐ │
│ │ Gradient   │ │  │ │  Text   │ │  │ │  R3F       │ │
│ │   Mesh     │ │  │ │Animations│ │  │ │  Canvas    │ │
│ └────────────┘ │  │ └─────────┘ │  │ └────────────┘ │
│                │  │             │  │                │
│ ┌────────────┐ │  │ ┌─────────┐ │  │ ┌────────────┐ │
│ │   Grid     │ │  │ │ Metrics │ │  │ │ Blockchain │ │
│ │  Pattern   │ │  │ │ Counter │ │  │ │   Nodes    │ │
│ └────────────┘ │  │ └─────────┘ │  │ └────────────┘ │
│                │  │             │  │                │
│ ┌────────────┐ │  │ ┌─────────┐ │  │ ┌────────────┐ │
│ │ Particle   │ │  │ │   CTA   │ │  │ │ Particle   │ │
│ │  Network   │ │  │ │ Buttons │ │  │ │  System    │ │
│ └────────────┘ │  │ └─────────┘ │  │ └────────────┘ │
│                │  │             │  │                │
│ ┌────────────┐ │  │ ┌─────────┐ │  │ ┌────────────┐ │
│ │   Noise    │ │  │ │ Status  │ │  │ │  Camera    │ │
│ │  Texture   │ │  │ │  Badge  │ │  │ │  Controls  │ │
│ └────────────┘ │  │ └─────────┘ │  │ └────────────┘ │
└────────────────┘  └─────────────┘  └────────────────┘
```

## Component Library Structure

```
/components
│
├── /3d                          ← 3D Elements (React Three Fiber)
│   ├── /Canvas
│   │   ├── AdaptiveCanvas.tsx       ← Smart canvas with device detection
│   │   ├── Scene.tsx                ← Main scene container
│   │   └── Fallback.tsx             ← Non-WebGL fallback
│   │
│   ├── /Objects
│   │   ├── BlockchainNode.tsx       ← Floating geometric shapes
│   │   ├── ParticleSystem.tsx       ← GPU particle system
│   │   ├── ConnectionLines.tsx      ← Lines between nodes
│   │   └── Grid3D.tsx              ← 3D grid background
│   │
│   ├── /Cameras
│   │   ├── ScrollCamera.tsx         ← Scroll-controlled camera
│   │   └── MouseCamera.tsx          ← Mouse-reactive camera
│   │
│   ├── /Lights
│   │   ├── DynamicLighting.tsx      ← Animated lights
│   │   └── EnvironmentLight.tsx     ← HDR environment
│   │
│   └── /Effects
│       ├── Bloom.tsx                ← Post-processing bloom
│       ├── ChromaticAberration.tsx  ← Color separation
│       └── Vignette.tsx             ← Edge darkening
│
├── /backgrounds                 ← Background Effects
│   ├── AnimatedMeshGradient.tsx     ← Morphing gradients
│   ├── GradientOrbs.tsx             ← Floating orbs
│   ├── DotGrid.tsx                  ← Perspective dot grid
│   ├── HexagonGrid.tsx              ← Honeycomb pattern
│   ├── WireframeGrid.tsx            ← 3D wireframe
│   ├── CanvasParticleNetwork.tsx    ← Canvas-based particles
│   ├── WebGLParticles.tsx           ← WebGL particles
│   └── TSParticles.tsx              ← tsparticles integration
│
├── /buttons                     ← Button Components
│   ├── PrimaryButton.tsx            ← Main CTA button
│   ├── GhostButton.tsx              ← Transparent button
│   ├── GradientButton.tsx           ← Gradient background
│   ├── MagneticButton.tsx           ← Magnetic hover effect
│   ├── NeonButton.tsx               ← Neon glow effect
│   └── IconButton.tsx               ← Icon-only button
│
├── /cards                       ← Card Components
│   ├── GlassmorphicCard.tsx         ← Glass effect card
│   ├── HolographicCard.tsx          ← Metallic hologram
│   ├── NeonCard.tsx                 ← Neon border glow
│   ├── Card3D.tsx                   ← 3D flip/rotate
│   └── PricingCard.tsx              ← Pricing display
│
├── /hero                        ← Hero Section Components
│   ├── HeroCanvas3D.tsx             ← 3D canvas for hero
│   ├── AnimatedHeroText.tsx         ← Animated typography
│   ├── HeroMetrics3D.tsx            ← 3D metrics display
│   ├── HeroCTA.tsx                  ← Call-to-action buttons
│   ├── ScrollIndicator.tsx          ← Scroll hint animation
│   └── /Scene
│       ├── BlockchainNodes.tsx      ← Blockchain visualization
│       ├── ParticleNetwork.tsx      ← Hero particles
│       └── Lighting.tsx             ← Hero lighting setup
│
├── /interactive                 ← Interactive Elements
│   ├── GlassCard.tsx                ← Interactive glass card
│   ├── HoverReveal.tsx              ← Reveal on hover
│   ├── MouseFollow.tsx              ← Mouse follower
│   ├── Tilt3D.tsx                   ← 3D tilt effect
│   ├── RippleEffect.tsx             ← Click ripple
│   ├── DragCard.tsx                 ← Draggable card
│   ├── SwipeCarousel.tsx            ← Swipeable carousel
│   ├── PinchZoom.tsx                ← Pinch to zoom
│   └── TouchOptimized.tsx           ← Touch-friendly wrapper
│
├── /navigation                  ← Navigation Components
│   ├── FloatingNav.tsx              ← Floating navbar
│   ├── MobileMenu.tsx               ← Mobile hamburger menu
│   ├── NavLink.tsx                  ← Animated nav link
│   ├── MegaMenu.tsx                 ← Mega menu dropdown
│   ├── SideNav.tsx                  ← Slide-out sidebar
│   └── TabNav.tsx                   ← Tab navigation
│
├── /scroll                      ← Scroll Components
│   ├── SmoothScroll.tsx             ← Smooth scroll provider
│   ├── ScrollReveal.tsx             ← Reveal on scroll
│   ├── ParallaxSection.tsx          ← Parallax effect
│   ├── PinSection.tsx               ← Pin while scrolling
│   └── ScrollProgress.tsx           ← Progress indicator
│
├── /typography                  ← Typography Components
│   ├── GradientText.tsx             ← Gradient text
│   ├── SplitText.tsx                ← Split text animation
│   ├── TypewriterText.tsx           ← Typewriter effect
│   └── AnimatedCounter.tsx          ← Number counter
│
└── /sections                    ← Page Sections
    ├── HeroSection.tsx              ← Hero section
    ├── FeaturesSection.tsx          ← Features grid
    ├── MarketsSection.tsx           ← Active markets
    ├── HowItWorksSection.tsx        ← Process steps
    └── CTASection.tsx               ← Final call-to-action
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Actions                          │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐  ┌──────▼──────┐  ┌───────▼────────┐
│   Scroll       │  │    Hover    │  │     Click      │
│   Events       │  │   Events    │  │    Events      │
└────────────────┘  └─────────────┘  └────────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                  ┌────────▼─────────┐
                  │  Event Handlers  │
                  └────────┬─────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐  ┌──────▼──────┐  ┌───────▼────────┐
│  Framer Motion │  │    GSAP     │  │  R3F useFrame  │
│    Animations  │  │  Timelines  │  │   Render Loop  │
└────────────────┘  └─────────────┘  └────────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                  ┌────────▼─────────┐
                  │   GPU Rendering  │
                  │   (60 FPS)       │
                  └────────┬─────────┘
                           │
                  ┌────────▼─────────┐
                  │   DOM Updates    │
                  └──────────────────┘
```

## Animation System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Animation Controller                       │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐  ┌──────▼──────┐  ┌───────▼────────┐
│ Framer Motion  │  │     GSAP    │  │  CSS Keyframes │
│  (Primary)     │  │(Complementary)│  │   (Baseline)   │
└────────────────┘  └─────────────┘  └────────────────┘
        │                  │                  │
        │                  │                  │
┌───────┴────────┐  ┌──────┴──────┐  ┌───────┴────────┐
│                │  │             │  │                │
│ ┌────────────┐ │  │ ┌─────────┐ │  │ ┌────────────┐ │
│ │  Variants  │ │  │ │Timeline │ │  │ │ @keyframes │ │
│ └────────────┘ │  │ └─────────┘ │  │ └────────────┘ │
│                │  │             │  │                │
│ ┌────────────┐ │  │ ┌─────────┐ │  │ ┌────────────┐ │
│ │ useScroll  │ │  │ │ScrollTrg│ │  │ │  animation │ │
│ └────────────┘ │  │ └─────────┘ │  │ └────────────┘ │
│                │  │             │  │                │
│ ┌────────────┐ │  │ ┌─────────┐ │  │ ┌────────────┐ │
│ │  Gestures  │ │  │ │SVG Morph│ │  │ │ transition │ │
│ └────────────┘ │  │ └─────────┘ │  │ └────────────┘ │
└────────────────┘  └─────────────┘  └────────────────┘

        │                  │                  │
        └──────────────────┴──────────────────┘
                           │
                  ┌────────▼─────────┐
                  │ Animation Queue  │
                  │  (Orchestrator)  │
                  └────────┬─────────┘
                           │
                  ┌────────▼─────────┐
                  │  GPU Acceleration│
                  │  (transform/     │
                  │   opacity only)  │
                  └──────────────────┘
```

## Performance Optimization Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      Layer 1: Code Splitting                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Vendor   │  │   Common   │  │    Three   │            │
│  │   Chunk    │  │   Chunk    │  │    Chunk   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────▼───────────────────────────────────┐
│                    Layer 2: Lazy Loading                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  dynamic() │  │ Suspense   │  │  Route     │            │
│  │  imports   │  │ boundaries │  │  Splitting │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────▼───────────────────────────────────┐
│                   Layer 3: Device Adaptation                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Mobile    │  │   Tablet   │  │  Desktop   │            │
│  │  (Simple)  │  │  (Medium)  │  │  (Complex) │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────▼───────────────────────────────────┐
│                   Layer 4: Rendering Pipeline                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   React    │  │   WebGL    │  │    CSS     │            │
│  │   VDOM     │  │   GPU      │  │   GPU      │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────▼───────────────────────────────────┐
│                   Layer 5: Browser Rendering                 │
│                   ┌────────────────┐                         │
│                   │   60 FPS       │                         │
│                   │   (16.67ms)    │                         │
│                   └────────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

## Responsive Breakpoint Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile First Approach                    │
└─────────────────────────────────────────────────────────────┘

375px (xs)  ─────────────────────────────────┐
             Small Phones                     │
             ┌──────────────────────┐         │
             │ - Single column      │         │
             │ - Simple animations  │         │
             │ - No 3D (fallback)   │         │
             │ - Touch optimized    │         │
             └──────────────────────┘         │
                                              │
640px (sm)  ──────────────────────────────────┤
             Large Phones                     │
             ┌──────────────────────┐         │
             │ - Larger touch targets│        │
             │ - Simple 3D effects  │         │
             │ - Basic particles    │         │
             └──────────────────────┘         │
                                              │
768px (md)  ──────────────────────────────────┤
             Tablets                          │
             ┌──────────────────────┐         │
             │ - 2 column layouts   │         │
             │ - Medium 3D quality  │         │
             │ - More particles     │         │
             │ - Hover effects      │         │
             └──────────────────────┘         │
                                              │
1024px (lg) ──────────────────────────────────┤
             Small Laptops                    │
             ┌──────────────────────┐         │
             │ - 3 column layouts   │         │
             │ - High 3D quality    │         │
             │ - Full effects       │         │
             │ - Advanced animations│         │
             └──────────────────────┘         │
                                              │
1280px (xl) ──────────────────────────────────┤
             Desktops                         │
             ┌──────────────────────┐         │
             │ - Full experience    │         │
             │ - Maximum particles  │         │
             │ - Post-processing    │         │
             │ - All interactions   │         │
             └──────────────────────┘         │
                                              │
1920px (2xl) ─────────────────────────────────┤
             Large Desktops                   │
             ┌──────────────────────┐         │
             │ - Ultra HD quality   │         │
             │ - Maximum effects    │         │
             │ - Enhanced details   │         │
             └──────────────────────┘         │
                                              │
2560px (3xl) ─────────────────────────────────┘
             Ultra Wide
             ┌──────────────────────┐
             │ - 4K optimized       │
             │ - Premium experience │
             └──────────────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Component State                         │
│                      (useState, useRef)                      │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Local state only
                           │
┌─────────────────────────▼───────────────────────────────────┐
│                      Context Providers                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Wallet   │  │   Theme    │  │   Scroll   │            │
│  │  Context   │  │  Context   │  │  Context   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Shared state
                           │
┌─────────────────────────▼───────────────────────────────────┐
│                      Custom Hooks                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │useMarkets  │  │useDevice   │  │useAnimation│            │
│  │            │  │Capabilities│  │   Frame    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Business logic
                           │
┌─────────────────────────▼───────────────────────────────────┐
│                      External State                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Solana    │  │  Supabase  │  │   Local    │            │
│  │ Blockchain │  │  Database  │  │  Storage   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Development                             │
│                  (npm run dev --turbopack)                   │
└─────────────────────────────────────────────────────────────┘
                           │
                   ┌───────▼────────┐
                   │  git push      │
                   └───────┬────────┘
                           │
┌─────────────────────────▼───────────────────────────────────┐
│                      CI/CD Pipeline                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Tests    │→ │   Build    │→ │  Lighthouse│            │
│  │            │  │            │  │   Audit    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
                   ┌───────▼────────┐
                   │   Deploy       │
                   └───────┬────────┘
                           │
┌─────────────────────────▼───────────────────────────────────┐
│                      Production                              │
│                    (Vercel/Netlify)                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │    CDN     │  │   Edge     │  │  Analytics │            │
│  │            │  │ Functions  │  │            │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
                   ┌───────▼────────┐
                   │   Monitoring   │
                   │  (Sentry, etc) │
                   └────────────────┘
```

## Technology Stack Summary

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Stack                          │
├─────────────────────────────────────────────────────────────┤
│ Framework:        Next.js 16 (App Router)                   │
│ UI Library:       React 19                                  │
│ Styling:          Tailwind CSS v4                           │
│ Animations:       Framer Motion, GSAP                       │
│ 3D Graphics:      React Three Fiber, Drei                   │
│ Particles:        TSParticles, Custom WebGL                 │
│ Smooth Scroll:    Lenis, Locomotive Scroll                  │
│ Gestures:         @use-gesture/react                        │
│ Type Safety:      TypeScript 5.9+                           │
├─────────────────────────────────────────────────────────────┤
│                      Blockchain                              │
├─────────────────────────────────────────────────────────────┤
│ Network:          Solana                                    │
│ Wallet:           @solana/wallet-adapter                    │
│ Anchor:           @coral-xyz/anchor                         │
├─────────────────────────────────────────────────────────────┤
│                      Developer Tools                         │
├─────────────────────────────────────────────────────────────┤
│ Package Manager:  npm                                       │
│ Bundler:          Next.js (Turbopack)                       │
│ Testing:          Jest, React Testing Library              │
│ Linting:          ESLint                                    │
│ Performance:      Lighthouse CI, r3f-perf                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Matrix

| Component Type     | Framer Motion | GSAP | R3F | CSS | Gestures |
|--------------------|---------------|------|-----|-----|----------|
| Hero Text          | ✅            | ✅   | ❌  | ❌  | ❌       |
| 3D Canvas          | ❌            | ❌   | ✅  | ❌  | ✅       |
| Buttons            | ✅            | ❌   | ❌  | ✅  | ✅       |
| Cards              | ✅            | ❌   | ❌  | ✅  | ✅       |
| Backgrounds        | ✅            | ❌   | ❌  | ✅  | ❌       |
| Scroll Effects     | ✅            | ✅   | ✅  | ❌  | ❌       |
| Navigation         | ✅            | ❌   | ❌  | ✅  | ✅       |
| Particles          | ❌            | ❌   | ✅  | ❌  | ❌       |

---

This architecture provides a solid foundation for building an award-winning Web3 landing page with premium animations, 3D effects, and optimal performance.
