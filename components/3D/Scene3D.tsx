'use client';

import React, { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Vector3, Mesh, IcosahedronGeometry, TorusGeometry } from 'three';
import * as THREE from 'three';

// Types
interface FloatingShapeProps {
  position: [number, number, number];
  geometry: 'icosahedron' | 'torus';
  scale: number;
  rotationSpeed: [number, number, number];
  floatSpeed: number;
  floatRange: number;
  color: string;
  emissiveIntensity: number;
  mouseInfluence?: number;
}

interface SceneContentProps {
  mousePosition: { x: number; y: number };
}

// Floating Shape Component
function FloatingShape({
  position,
  geometry,
  scale,
  rotationSpeed,
  floatSpeed,
  floatRange,
  color,
  emissiveIntensity,
  mouseInfluence = 0.5,
}: FloatingShapeProps) {
  const meshRef = useRef<Mesh>(null);
  const initialY = position[1];
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  // Memoize geometries
  const geo = useMemo(() => {
    if (geometry === 'icosahedron') {
      return new IcosahedronGeometry(1, 0);
    }
    return new TorusGeometry(1, 0.4, 16, 32);
  }, [geometry]);

  // Update animation
  useEffect(() => {
    let animationFrameId: number;

    const animate = (time: number) => {
      if (meshRef.current) {
        const t = time * 0.001; // Convert to seconds

        // Rotation
        meshRef.current.rotation.x += rotationSpeed[0];
        meshRef.current.rotation.y += rotationSpeed[1];
        meshRef.current.rotation.z += rotationSpeed[2];

        // Floating motion
        meshRef.current.position.y =
          initialY + Math.sin(t * floatSpeed + timeOffset) * floatRange;

        // Subtle drift
        meshRef.current.position.x =
          position[0] + Math.sin(t * 0.3 + timeOffset) * 0.2;
        meshRef.current.position.z =
          position[2] + Math.cos(t * 0.3 + timeOffset) * 0.2;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [position, initialY, rotationSpeed, floatSpeed, floatRange, timeOffset]);

  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geo}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// Scene Content
function SceneContent({ mousePosition }: SceneContentProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Create nodes configuration
  const nodes = useMemo(() => {
    const colors = {
      purple: '#a855f7',
      blue: '#3b82f6',
      pink: '#ec4899',
      cyan: '#06b6d4',
      violet: '#8b5cf6',
    };

    return [
      // Icosahedrons (blockchain nodes)
      {
        position: [-4, 2, -5] as [number, number, number],
        geometry: 'icosahedron' as const,
        scale: 0.8,
        rotationSpeed: [0.001, 0.002, 0] as [number, number, number],
        floatSpeed: 0.8,
        floatRange: 0.5,
        color: colors.purple,
        emissiveIntensity: 1.2,
      },
      {
        position: [4, -1, -8] as [number, number, number],
        geometry: 'icosahedron' as const,
        scale: 1.2,
        rotationSpeed: [0.002, -0.001, 0.001] as [number, number, number],
        floatSpeed: 1.2,
        floatRange: 0.7,
        color: colors.blue,
        emissiveIntensity: 1.5,
      },
      {
        position: [-3, -2, -6] as [number, number, number],
        geometry: 'icosahedron' as const,
        scale: 0.6,
        rotationSpeed: [-0.001, 0.003, 0.001] as [number, number, number],
        floatSpeed: 0.9,
        floatRange: 0.4,
        color: colors.pink,
        emissiveIntensity: 1.0,
      },
      {
        position: [2, 3, -7] as [number, number, number],
        geometry: 'icosahedron' as const,
        scale: 0.9,
        rotationSpeed: [0.003, 0.001, -0.002] as [number, number, number],
        floatSpeed: 1.1,
        floatRange: 0.6,
        color: colors.violet,
        emissiveIntensity: 1.3,
      },

      // Toruses (connection rings)
      {
        position: [0, 0, -10] as [number, number, number],
        geometry: 'torus' as const,
        scale: 1.5,
        rotationSpeed: [0.002, 0.002, 0] as [number, number, number],
        floatSpeed: 0.6,
        floatRange: 0.3,
        color: colors.cyan,
        emissiveIntensity: 0.8,
      },
      {
        position: [-5, 1, -9] as [number, number, number],
        geometry: 'torus' as const,
        scale: 1.0,
        rotationSpeed: [-0.001, 0.003, 0.002] as [number, number, number],
        floatSpeed: 1.0,
        floatRange: 0.5,
        color: colors.purple,
        emissiveIntensity: 1.0,
      },
      {
        position: [5, -2, -6] as [number, number, number],
        geometry: 'torus' as const,
        scale: 0.7,
        rotationSpeed: [0.001, -0.002, 0.001] as [number, number, number],
        floatSpeed: 1.3,
        floatRange: 0.4,
        color: colors.pink,
        emissiveIntensity: 0.9,
      },

      // Additional depth nodes
      {
        position: [3, 1, -12] as [number, number, number],
        geometry: 'icosahedron' as const,
        scale: 1.1,
        rotationSpeed: [0.001, 0.002, -0.001] as [number, number, number],
        floatSpeed: 0.7,
        floatRange: 0.6,
        color: colors.blue,
        emissiveIntensity: 1.1,
      },
      {
        position: [-2, -3, -11] as [number, number, number],
        geometry: 'torus' as const,
        scale: 1.3,
        rotationSpeed: [0.002, -0.001, 0.003] as [number, number, number],
        floatSpeed: 0.9,
        floatRange: 0.5,
        color: colors.violet,
        emissiveIntensity: 1.2,
      },
    ];
  }, []);

  // Log when scene content renders
  useEffect(() => {
    console.log('Scene3D: SceneContent rendered with', nodes.length, 'shapes');
  }, [nodes.length]);

  // Apply subtle parallax based on mouse position
  useEffect(() => {
    if (groupRef.current) {
      const targetX = mousePosition.x * 0.5;
      const targetY = mousePosition.y * 0.5;

      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
    }
  }, [mousePosition]);

  return (
    <group ref={groupRef}>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />

      {/* Key lights for depth */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#a855f7" />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#3b82f6" />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#ec4899" distance={20} />

      {/* Render floating shapes */}
      {nodes.map((node, index) => (
        <FloatingShape key={index} {...node} />
      ))}
    </group>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Scene Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-950 via-slate-900 to-blue-950">
          <p className="text-white/50 text-sm">3D Scene unavailable</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Fallback
function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
    </div>
  );
}

// Main Scene3D Component
export default function Scene3D() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);

  // Check WebGL support
  useEffect(() => {
    console.log('Scene3D: Component mounted');
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      setIsWebGLAvailable(false);
      console.warn('Scene3D: WebGL not supported, falling back to gradient background');
    } else {
      console.log('Scene3D: WebGL available, initializing 3D scene');
    }
  }, []);

  // Track mouse movement for parallax
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fallback for non-WebGL browsers
  if (!isWebGLAvailable) {
    return (
      <div className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-br from-purple-950 via-slate-900 to-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Canvas
          dpr={[1, 2]} // Adaptive pixel ratio for performance
          performance={{ min: 0.5 }} // Performance monitoring
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950"
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />

            <SceneContent mousePosition={mousePosition} />

            {/* Post-processing effects */}
            <EffectComposer>
              <Bloom
                intensity={1.5}
                luminanceThreshold={0.3}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
            </EffectComposer>

            {/* Optional: Enable orbit controls for testing (remove for production) */}
            {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
          </Suspense>
        </Canvas>

        {/* Gradient overlay for smooth blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/50 pointer-events-none" />
      </div>
    </ErrorBoundary>
  );
}
