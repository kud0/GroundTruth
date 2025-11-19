# ADR-002: 3D Rendering Implementation

## Status
Proposed

## Context
The premium landing page requires 3D elements including:
- Floating geometric shapes (blockchain nodes)
- Particle network systems
- Interactive 3D backgrounds
- Camera animations and parallax
- Mouse-reactive lighting
- Responsive 3D across devices

We need to choose a 3D rendering approach that balances visual quality, performance, and developer experience while maintaining 60 FPS on desktop and 30+ FPS on mobile.

## Decision Drivers
1. Performance on low-end devices
2. Bundle size impact
3. React 19 compatibility
4. Developer experience
5. TypeScript support
6. Mobile device support
7. WebGL compatibility
8. Maintainability

## Options Considered

### Option 1: React Three Fiber + Drei (Recommended)
**Technology:**
- React Three Fiber (R3F): React renderer for Three.js
- Drei: Helper library with ready-made components
- Three.js: WebGL library

**Pros:**
- React-native API (hooks, components, JSX)
- Excellent TypeScript support
- Large ecosystem and community
- Performance optimizations built-in
- Declarative scene management
- Hot reload support
- Suspense and lazy loading
- Extensive documentation

**Cons:**
- Bundle size: ~130KB (Three.js + R3F + Drei)
- Learning curve for 3D concepts
- Requires WebGL support (95% browser coverage)
- Can be overkill for simple effects

**Bundle Size:**
```
three: ~560KB raw → ~130KB gzipped
@react-three/fiber: ~50KB raw → ~12KB gzipped
@react-three/drei: ~200KB raw → ~45KB gzipped
Total: ~187KB gzipped
```

### Option 2: Raw Three.js
**Pros:**
- Full control over rendering
- Smaller bundle (just Three.js core)
- Maximum performance potential
- Direct access to all features

**Cons:**
- Imperative API (less React-friendly)
- Manual memory management
- More boilerplate code
- Harder to integrate with React lifecycle
- Ref management complexity

### Option 3: CSS 3D Transforms
**Pros:**
- Zero JavaScript for 3D
- Great performance
- No bundle size impact
- Simple transforms easy

**Cons:**
- Very limited 3D capabilities
- No lighting or materials
- Can't render complex geometries
- Poor cross-browser consistency
- Limited to basic transforms

### Option 4: Babylon.js
**Pros:**
- Feature-rich game engine
- Excellent documentation
- Built-in physics
- Advanced effects

**Cons:**
- Very large bundle (~500KB+)
- Overkill for landing page
- Imperative API
- Less React ecosystem

## Decision

**Primary: React Three Fiber + Drei**
- Use for all 3D elements on landing page
- Component-based architecture
- Lazy load below the fold
- Adaptive quality based on device

**Fallback: CSS 3D Transforms**
- Use for browsers without WebGL
- Progressive enhancement
- Simple geometric shapes only

## Rationale

### Why React Three Fiber?

1. **React Integration:**
```typescript
// Declarative, React-friendly
<Canvas>
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} />
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="purple" />
  </mesh>
</Canvas>

// vs Imperative Three.js
const scene = new THREE.Scene()
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 'purple' })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
// ... cleanup required
```

2. **Performance Optimizations:**
```typescript
// Automatic frame loop management
// Automatic disposal of resources
// Built-in frustum culling
// Instance rendering support
```

3. **Developer Experience:**
```typescript
// Hot reload works perfectly
// React DevTools integration
// TypeScript definitions
// Suspense for loading
```

4. **Ecosystem:**
```typescript
// @react-three/drei - 100+ helpers
// @react-three/postprocessing - Effects
// @react-three/rapier - Physics
// @react-three/a11y - Accessibility
```

## Implementation Architecture

### File Structure
```
/components/3d/
├── Canvas/
│   ├── AdaptiveCanvas.tsx        # Responsive R3F Canvas
│   ├── Scene.tsx                 # Main scene container
│   └── Fallback.tsx              # Non-WebGL fallback
├── Objects/
│   ├── BlockchainNode.tsx        # Floating geometric shapes
│   ├── ParticleSystem.tsx        # GPU particle system
│   ├── ConnectionLines.tsx       # Lines between nodes
│   └── Grid3D.tsx                # 3D grid background
├── Effects/
│   ├── Bloom.tsx                 # Post-processing bloom
│   ├── ChromaticAberration.tsx   # Color separation
│   └── Vignette.tsx              # Edge darkening
├── Cameras/
│   ├── ScrollCamera.tsx          # Scroll-controlled camera
│   └── MouseCamera.tsx           # Mouse-reactive camera
└── Lights/
    ├── DynamicLighting.tsx       # Animated lights
    └── EnvironmentLight.tsx      # HDR environment
```

### Component Patterns

#### 1. Adaptive Canvas
```typescript
// /components/3d/Canvas/AdaptiveCanvas.tsx
import { Canvas } from '@react-three/fiber'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'

export function AdaptiveCanvas({ children }) {
  const { isMobile, isHighPerformance } = useDeviceCapabilities()

  const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 2)
  const shadows = isHighPerformance && !isMobile

  return (
    <Canvas
      dpr={dpr}
      shadows={shadows}
      performance={{
        min: 0.5, // Allow degradation to 30 FPS
        max: 1,
        debounce: 200
      }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance'
      }}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  )
}
```

#### 2. Instanced Particles
```typescript
// /components/3d/Objects/ParticleSystem.tsx
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleSystem({ count = 1000 }) {
  const meshRef = useRef()

  // Generate random positions once
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return pos
  }, [count])

  // Animate particles
  useFrame((state) => {
    const time = state.clock.elapsedTime
    meshRef.current.rotation.y = time * 0.05
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#a855f7"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}
```

#### 3. Blockchain Node
```typescript
// /components/3d/Objects/BlockchainNode.tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'

export function BlockchainNode({ position, color = '#a855f7' }) {
  const meshRef = useRef()

  useFrame((state) => {
    const time = state.clock.elapsedTime
    // Floating animation
    meshRef.current.position.y = position[1] + Math.sin(time) * 0.2
    // Gentle rotation
    meshRef.current.rotation.x = time * 0.1
    meshRef.current.rotation.y = time * 0.15
  })

  return (
    <mesh ref={meshRef} position={position}>
      <dodecahedronGeometry args={[1, 0]} />
      <MeshTransmissionMaterial
        color={color}
        thickness={0.5}
        roughness={0.1}
        transmission={0.9}
        ior={1.5}
        chromaticAberration={0.05}
      />
    </mesh>
  )
}
```

#### 4. Mouse-Reactive Camera
```typescript
// /components/3d/Cameras/MouseCamera.tsx
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'

export function MouseCamera() {
  const { camera, viewport } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    // Smooth camera movement
    camera.position.x += (mouse.current.x * 2 - camera.position.x) * 0.05
    camera.position.y += (mouse.current.y * 2 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })

  return null
}
```

#### 5. Scroll-Controlled Camera
```typescript
// /components/3d/Cameras/ScrollCamera.tsx
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from 'framer-motion'

export function ScrollCamera() {
  const { camera } = useThree()
  const { scrollYProgress } = useScroll()

  useFrame(() => {
    const progress = scrollYProgress.get()
    // Move camera based on scroll
    camera.position.z = 10 - progress * 5
    camera.position.y = progress * 3
  })

  return null
}
```

### Performance Optimization Strategies

#### 1. Level of Detail (LOD)
```typescript
import { Lod } from '@react-three/drei'

<Lod distances={[0, 10, 20]}>
  {/* High detail */}
  <mesh geometry={highPolyGeometry} />
  {/* Medium detail */}
  <mesh geometry={mediumPolyGeometry} />
  {/* Low detail */}
  <mesh geometry={lowPolyGeometry} />
</Lod>
```

#### 2. Frustum Culling (Automatic)
```typescript
// R3F automatically culls objects outside camera view
// No additional code needed
```

#### 3. Instancing for Repeated Objects
```typescript
import { Instances, Instance } from '@react-three/drei'

<Instances limit={1000} geometry={sphereGeometry} material={material}>
  {positions.map((pos, i) => (
    <Instance key={i} position={pos} />
  ))}
</Instances>
```

#### 4. Lazy Loading
```typescript
import dynamic from 'next/dynamic'

// Don't load 3D on server
const Scene3D = dynamic(
  () => import('@/components/3d/Scene'),
  { ssr: false }
)

// Lazy load when in viewport
const HeroCanvas = dynamic(
  () => import('@/components/3d/HeroCanvas'),
  {
    ssr: false,
    loading: () => <CanvasSkeleton />
  }
)
```

#### 5. GPU Particle System
```typescript
// Use custom shaders for 100k+ particles
import { shaderMaterial } from '@react-three/drei'

const ParticleMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color('#a855f7') },
  // Vertex shader
  `
    uniform float time;
    attribute float size;
    varying vec3 vColor;

    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment shader
  `
    uniform vec3 color;
    varying vec3 vColor;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      gl_FragColor = vec4(color, 1.0 - dist * 2.0);
    }
  `
)
```

## Device Adaptation Strategy

### Mobile Optimization
```typescript
export function MobileOptimized3D() {
  const capabilities = useDeviceCapabilities()

  const config = {
    particleCount: capabilities.isMobile ? 100 : 1000,
    shadowsEnabled: !capabilities.isMobile,
    postProcessing: capabilities.isHighPerformance,
    dpr: capabilities.isMobile ? 1 : 2,
    antialias: !capabilities.isMobile
  }

  return (
    <Canvas dpr={config.dpr} shadows={config.shadowsEnabled}>
      <ParticleSystem count={config.particleCount} />
      {config.postProcessing && <EffectsComposer />}
    </Canvas>
  )
}
```

### Progressive Enhancement
```typescript
export function Progressive3D() {
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    setWebglSupported(!!gl)
  }, [])

  if (!webglSupported) {
    return <CSS3DFallback />
  }

  return <Canvas>{/* 3D content */}</Canvas>
}
```

## Testing Strategy

### Performance Testing
```typescript
// Monitor FPS
import { Perf } from 'r3f-perf'

<Canvas>
  {process.env.NODE_ENV === 'development' && <Perf position="top-left" />}
  {/* Scene content */}
</Canvas>
```

### Visual Testing
```typescript
// Take screenshots for regression testing
test('3D scene renders correctly', async () => {
  const { container } = render(<Canvas><Scene /></Canvas>)
  await waitFor(() => {
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })
  // Use Percy or similar for visual comparison
})
```

## Fallback Strategy

### CSS 3D Fallback
```typescript
// /components/3d/Fallback.tsx
export function CSS3DFallback() {
  return (
    <div className="relative w-full h-full">
      {/* Use CSS 3D transforms */}
      <div className="absolute inset-0 transform-style-3d perspective-1000">
        <div className="transform rotate-y-45 translate-z-10 bg-purple-500/10 border border-purple-500/20">
          {/* Simple geometric shapes */}
        </div>
      </div>
    </div>
  )
}
```

## Bundle Size Mitigation

### Code Splitting
```typescript
// Split Three.js modules
import { Canvas } from '@react-three/fiber'
import { lazy } from 'react'

const PostProcessing = lazy(() =>
  import('@react-three/postprocessing').then(m => ({ default: m.EffectComposer }))
)

const PhysicsEngine = lazy(() =>
  import('@react-three/rapier').then(m => ({ default: m.Physics }))
)
```

### Tree Shaking
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: [
      '@react-three/fiber',
      '@react-three/drei',
      'three'
    ]
  }
}
```

## Accessibility

### Reduced Motion
```typescript
export function AccessibleCanvas({ children }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <Canvas frameloop={prefersReducedMotion ? 'never' : 'always'}>
      {children}
    </Canvas>
  )
}
```

### ARIA Support
```typescript
<Canvas aria-label="3D visualization of blockchain network">
  {/* 3D content */}
</Canvas>
```

## Consequences

### Positive
- React-native API improves maintainability
- Automatic memory management prevents leaks
- Hot reload speeds up development
- Large ecosystem of helpers and components
- TypeScript support catches errors early
- Performance optimizations built-in

### Negative
- 187KB bundle size impact
- Requires WebGL (though 95% browser support)
- Learning curve for 3D concepts
- Can be slow on very old devices
- Fallback required for non-WebGL browsers

### Neutral
- Need to educate team on R3F patterns
- Requires performance testing on real devices
- May need to hire 3D specialist
- Ongoing monitoring of bundle size

## Migration Path

### Phase 1: Setup (Week 1)
1. Install React Three Fiber and Drei
2. Create adaptive canvas wrapper
3. Setup device capability detection
4. Build fallback components

### Phase 2: Basic 3D (Week 2-3)
1. Implement floating geometric shapes
2. Add basic lighting
3. Create particle system
4. Test on mobile devices

### Phase 3: Advanced Effects (Week 4-5)
1. Add post-processing effects
2. Implement mouse-reactive camera
3. Create scroll-controlled animations
4. Optimize performance

### Phase 4: Polish (Week 6)
1. Fine-tune animations
2. Add reduced motion support
3. Performance testing
4. Cross-browser testing

## Success Metrics
- 60 FPS on desktop (16.67ms/frame)
- 30 FPS on mobile (33.33ms/frame)
- Bundle size < 200KB total
- < 3s initial load time
- 95%+ browser compatibility

## References
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei Components](https://github.com/pmndrs/drei)
- [Three.js Manual](https://threejs.org/manual/)
- [WebGL Stats](https://caniuse.com/webgl)
- [3D Performance Best Practices](https://discoverthreejs.com/tips-and-tricks/)

## Decision Date
2025-11-18

## Reviewers
- Frontend Lead
- 3D Graphics Specialist
- Performance Engineer
