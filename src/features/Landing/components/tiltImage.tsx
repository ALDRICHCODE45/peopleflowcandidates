"use client";

import { useRef, useCallback } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";
import type { MouseEvent } from "react";

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

interface TiltedImageProps {
  rotateAmplitude?: number;
}

export default function TiltedImage({ rotateAmplitude = 3 }: TiltedImageProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const lastYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const pendingEventRef = useRef<MouseEvent<HTMLElement> | null>(null);

  const handleMouse = useCallback((e: MouseEvent<HTMLElement>) => {
    // Guardar el evento más reciente
    pendingEventRef.current = e;

    // Si ya hay un RAF pendiente, no hacer nada
    if (rafIdRef.current !== null) {
      return;
    }

    // Usar requestAnimationFrame para throttling
    rafIdRef.current = requestAnimationFrame(() => {
      const event = pendingEventRef.current;
      if (!event || !ref.current) {
        rafIdRef.current = null;
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;

      const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
      const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

      rotateX.set(rotationX);
      rotateY.set(rotationY);

      x.set(event.clientX - rect.left);
      y.set(event.clientY - rect.top);

      const velocityY = offsetY - lastYRef.current;
      rotateFigcaption.set(-velocityY * 0.6);
      lastYRef.current = offsetY;

      // Limpiar el RAF
      rafIdRef.current = null;
      pendingEventRef.current = null;
    });
  }, [rotateAmplitude, rotateX, rotateY, rotateFigcaption, x, y]);

  const handleMouseLeave = useCallback(() => {
    // Cancelar cualquier RAF pendiente
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    pendingEventRef.current = null;

    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
    lastYRef.current = 0;
  }, [rotateX, rotateY, rotateFigcaption]);

  return (
    <motion.figure
      ref={ref}
      className="relative w-full h-full perspective-midrange mt-16 max-w-4xl mx-auto flex flex-col items-center justify-center"
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      initial={{ y: 150, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
    >
      <motion.div
        className="relative transform-3d w-full max-w-4xl"
        style={{ rotateX, rotateY }}
      >
        <img
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/hero-section-showcase-2.png"
          className="w-full rounded-[15px] will-change-transform transform-[translateZ(0)]"
          alt="hero section showcase"
        />
      </motion.div>
    </motion.figure>
  );
}
