"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Explosão de estrelas. O contentor pai tem de ser `relative`. */
export function StarBurst({ quantidade = 14 }: { quantidade?: number }) {
  const reduzir = useReducedMotion();
  if (reduzir) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
      {Array.from({ length: quantidade }, (_, i) => {
        const ang = (i / quantidade) * Math.PI * 2;
        const dist = 70 + (i % 3) * 28;
        return (
          <motion.span
            key={i}
            className="absolute text-2xl"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, scale: [0, 1.3, 0.8], opacity: [1, 1, 0] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            ⭐
          </motion.span>
        );
      })}
    </div>
  );
}
