'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

const LenisContext = createContext<React.RefObject<Lenis | null> | null>(null);

/** Returns a ref whose `.current` is the Lenis instance once mounted (or null before/if disabled). */
export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    // Skip custom smooth scroll on reduced motion or touch devices so mobile devices use native 120Hz/60Hz hardware scrolling
    if (prefersReduced || isCoarsePointer) return;

    const instance = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenisRef.current = instance;

    let rafId = requestAnimationFrame(function raf(time: number) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
