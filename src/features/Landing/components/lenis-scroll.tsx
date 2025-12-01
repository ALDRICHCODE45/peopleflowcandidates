"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisScroll() {
  useEffect(() => {
    // Detectar si es mobile o desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                     (typeof window !== 'undefined' && window.innerWidth < 768);
    
    // Deshabilitar Lenis en desktop para evitar problemas de rendimiento
    // El smooth scroll funciona mejor en mobile donde es más necesario
    if (!isMobile) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      // Optimizaciones adicionales
      touchMultiplier: 2,
      infinite: false,
    });

    let rafId: number;
    let isRunning = true;

    const raf = (time: number) => {
      if (!isRunning) return;
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      isRunning = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      lenis.destroy();
    };
  }, []);

  return null;
}
