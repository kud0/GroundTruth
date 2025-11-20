'use client';

import { useState } from 'react';
import { CustomCursor } from '@/components/CustomCursor';
import { Scanline } from '@/components/Scanline';
import { Loader } from '@/components/Loader';
import { ThreeBackground } from '@/components/ThreeBackground';
import { BrutalistNav } from '@/components/BrutalistNav';
import { HeroSection } from '@/components/sections/HeroSection';
import { ManifestoSection } from '@/components/sections/ManifestoSection';
import { HorizontalScrollSection } from '@/components/sections/HorizontalScrollSection';
import { FooterSection } from '@/components/sections/FooterSection';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Scanline Effect */}
      <Scanline />

      {/* Loader */}
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}

      {/* Three.js Background */}
      {isLoaded && <ThreeBackground />}

      {/* Navigation */}
      {isLoaded && <BrutalistNav />}

      {/* Main Content */}
      {isLoaded && (
        <main id="smooth-wrapper">
          <HeroSection />
          <ManifestoSection />
          <HorizontalScrollSection />
          <FooterSection />
        </main>
      )}
    </>
  );
}
