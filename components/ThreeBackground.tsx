'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import gsap from 'gsap';

const colors = {
  dark: { bg: 0x030303, particle: 0x14f195, line: 0x9945ff },
  light: { bg: 0xe8e8e5, particle: 0x008f53, line: 0x6d28d9 },
};

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const particleMeshRef = useRef<THREE.Points | null>(null);
  const linesMeshRef = useRef<THREE.LineSegments | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(colors.dark.bg, 0.03);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 2000;
    const posArray = new Float32Array(count * 3);
    const originalPos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
      originalPos[i] = posArray[i];
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: colors.dark.particle,
      transparent: true,
      opacity: 0.8,
    });
    const particleMesh = new THREE.Points(particlesGeometry, particleMaterial);
    particleMeshRef.current = particleMesh;
    scene.add(particleMesh);

    // Lines
    const linesMaterial = new THREE.LineBasicMaterial({
      color: colors.dark.line,
      opacity: 0.15,
      transparent: true,
    });
    const linesGeometry = new THREE.WireframeGeometry(
      new THREE.IcosahedronGeometry(3, 1)
    );
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    linesMeshRef.current = linesMesh;
    scene.add(linesMesh);

    camera.position.z = 6;

    // Mouse tracking
    let mouseX = 0,
      mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const clock = new THREE.Clock();

    function animate() {
      const elapsedTime = clock.getElapsedTime();
      requestAnimationFrame(animate);

      if (particleMesh && linesMesh) {
        particleMesh.rotation.y = elapsedTime * 0.05;
        linesMesh.rotation.x = elapsedTime * 0.05;
        linesMesh.rotation.y = elapsedTime * 0.05;

        particleMesh.rotation.x += mouseY * 0.005;
        particleMesh.rotation.y += mouseX * 0.005;

        // Wave effect
        const positions = particleMesh.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const x = originalPos[i3];
          positions[i3 + 1] = originalPos[i3 + 1] + Math.sin(elapsedTime + x) * 0.5;
        }
        particleMesh.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Theme change effect
  useEffect(() => {
    if (!sceneRef.current || !particleMeshRef.current || !linesMeshRef.current) return;

    const isDark = resolvedTheme === 'dark';
    const targetColors = isDark ? colors.dark : colors.light;

    const particleMaterial = particleMeshRef.current.material as THREE.PointsMaterial;
    const linesMaterial = linesMeshRef.current.material as THREE.LineBasicMaterial;

    // Animate fog
    if (sceneRef.current.fog) {
      gsap.to(sceneRef.current.fog.color, {
        r: new THREE.Color(targetColors.bg).r,
        g: new THREE.Color(targetColors.bg).g,
        b: new THREE.Color(targetColors.bg).b,
        duration: 1,
      });
    }

    // Animate particles
    gsap.to(particleMaterial.color, {
      r: new THREE.Color(targetColors.particle).r,
      g: new THREE.Color(targetColors.particle).g,
      b: new THREE.Color(targetColors.particle).b,
      duration: 1,
    });

    // Animate lines
    gsap.to(linesMaterial.color, {
      r: new THREE.Color(targetColors.line).r,
      g: new THREE.Color(targetColors.line).g,
      b: new THREE.Color(targetColors.line).b,
      duration: 1,
    });
  }, [resolvedTheme]);

  return <div id="webgl-container" ref={containerRef} />;
}
